import time
import shutil
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
from audio_loador import AudioLoader
from audio_processor import AudioProcessor
from audio_segmenter import AudioSegmenter
from logger import ConversionLogger

class WhisperVoiceConverter:
    def __init__(self, cutoff_freq=0, volume=0.95, 
                 enhancement_factor=1.2, sample_rate=44100):
        self.audio_loader = AudioLoader()
        self.audio_processor = AudioProcessor(sample_rate=sample_rate)
        self.processing_params = {
            'cutoff_freq': cutoff_freq,
            'volume': volume,
            'enhancement_factor': enhancement_factor
        }
        
    def convert_to_whisper(self, input_file, output_file):
        """Main conversion pipeline with advanced processing"""
        try:
            # 加载音频
            audio = self.audio_loader.load_audio(input_file)
            
            # 使用高级处理参数
            audio = self.audio_processor.process_audio_with_parameters(
                audio,
                cutoff_freq=800,
                volume=0.95,
                enhancement_factor=1.2
            )
            
            # 保存处理后的音频
            self.audio_loader.save_audio(audio, output_file)
            return True
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            return False

class BatchConverter:
    def __init__(self, config):
        """
        初始化批处理转换器
        config: 包含所有处理参数的配置字典
        """
        self.config = config
        self.converter = WhisperVoiceConverter(
            cutoff_freq=config['cutoff_freq'],
            volume=config['volume'],
            enhancement_factor=config['enhancement_factor'],
            sample_rate=config['sample_rate']
        )
        self.segmenter = AudioSegmenter(config['segment_duration'])
        self.logger = ConversionLogger()
        self.supported_formats = self.converter.audio_loader.supported_formats

    def setup_directories(self):
        """创建必要的目录结构"""
        directories = {
            'input': Path(self.config['input_dir']),
            'output': Path(self.config['output_dir']),
            'logs': Path('./logs'),
            'temp': Path('./temp')
        }
        
        for dir_path in directories.values():
            dir_path.mkdir(parents=True, exist_ok=True)
            
        return directories
        
    def get_audio_files(self, input_dir):
        """获取所有支持的音频文件"""
        audio_files = []
        for fmt in self.supported_formats:
            audio_files.extend(list(Path(input_dir).glob(f'*{fmt}')))
        return sorted(audio_files)  # 按文件名排序
        
    def create_output_path(self, input_file, output_dir):
        """创建输出文件路径"""
        output_name = f'whispered_{input_file.name}'
        return output_dir / output_name

    def process_single_file(self, input_file, output_file):
        """处理单个文件"""
        try:
            if self.config['use_segments']:
                # 分段处理
                segment_paths = self.segmenter.segment_audio(input_file)
                processed_segments = []
                
                # 处理每个片段
                for segment_path in segment_paths:
                    processed_path = segment_path.parent / f'processed_{segment_path.name}'
                    if self.converter.convert_to_whisper(str(segment_path), str(processed_path)):
                        processed_segments.append(processed_path)
                    else:
                        raise Exception(f"Failed to process segment {segment_path}")
                        
                # 合并片段
                success = self.segmenter.merge_segments(processed_segments, output_file)
                
                # 清理临时文件
                for path in segment_paths + processed_segments:
                    try:
                        path.unlink()
                    except:
                        pass
                try:
                    segment_paths[0].parent.rmdir()
                except:
                    pass
            else:
                # 直接处理整个文件
                success = self.converter.convert_to_whisper(str(input_file), str(output_file))
                
            if success:
                return True, input_file, None
            return False, input_file, "Processing failed"
            
        except Exception as e:
            return False, input_file, str(e)

    def batch_convert(self):
        """批量处理所有文件"""
        print("\n=== Whisper Voice Converter ===")
        print("\nInitializing with parameters:")
        print(f"Cutoff frequency: {self.config['cutoff_freq']} Hz")
        print(f"Volume: {self.config['volume']}")
        print(f"Enhancement factor: {self.config['enhancement_factor']}")
        print(f"Sample rate: {self.config['sample_rate']} Hz")
        
        # 设置目录
        dirs = self.setup_directories()
        print(f"\nWorking directories:")
        for name, path in dirs.items():
            print(f"  {name}: {path}")
        
        # 获取所有音频文件
        audio_files = self.get_audio_files(dirs['input'])
        if not audio_files:
            print("\nNo supported audio files found in input directory!")
            return
        
        print(f"\nFound {len(audio_files)} audio files to process")
        print("Supported formats:", ", ".join(self.supported_formats))
        
        # 创建进度条
        pbar = tqdm(total=len(audio_files), desc="Converting files")
        
        # 使用线程池进行并行处理
        with ThreadPoolExecutor(max_workers=self.config['max_workers']) as executor:
            future_to_file = {
                executor.submit(
                    self.process_single_file,
                    input_file,
                    self.create_output_path(input_file, dirs['output'])
                ): input_file
                for input_file in audio_files
            }
            
            for future in as_completed(future_to_file):
                success, input_file, error = future.result()
                if success:
                    self.logger.log_success(input_file.name)
                else:
                    self.logger.log_failure(input_file.name, error)
                pbar.update(1)
        
        pbar.close()
        
        # 清理临时目录
        try:
            shutil.rmtree(dirs['temp'])
        except:
            pass
        
        # 保存日志
        log_file = self.logger.save_log(dirs['logs'])
        
        # 打印最终结果
        print("\n=== Conversion Summary ===")
        print(f"Successfully processed: {len(self.logger.processed_files)} files")
        print(f"Failed: {len(self.logger.failed_files)} files")
        print(f"\nDetailed log saved to: {log_file}")
        
        if self.logger.failed_files:
            print("\nFailed files:")
            for file, error in self.logger.failed_files:
                print(f"- {file}: {error}")

def parse_arguments():
    parser = argparse.ArgumentParser(description='Whisper Voice Converter')
    
    # 目录参数
    parser.add_argument('--input-dir', type=str, default='./input',
                        help='Input directory containing audio files')
    parser.add_argument('--output-dir', type=str, default='./output',
                        help='Output directory for processed files')
    
    # 处理参数
    parser.add_argument('--cutoff-freq', type=int, default=800,
                        help='Cutoff frequency (Hz)')
    parser.add_argument('--volume', type=float, default=0.95,
                        help='Output volume (0.0-1.0)')
    parser.add_argument('--enhancement-factor', type=float, default=1.2,
                        help='High frequency enhancement factor')
    
    # 技术参数
    parser.add_argument('--sample-rate', type=int, default=44100,
                        help='Audio sample rate')
    parser.add_argument('--segment-duration', type=int, default=5,
                        help='Duration of audio segments in seconds')
    parser.add_argument('--max-workers', type=int, default=4,
                        help='Number of parallel processing workers')
    parser.add_argument('--no-segments', action='store_false', dest='use_segments',
                        help='Process files without segmentation')
    
    args = parser.parse_args()
    
    # 转换为配置字典
    config = {
        'input_dir': args.input_dir,
        'output_dir': args.output_dir,
        'cutoff_freq': args.cutoff_freq,
        'volume': args.volume,
        'enhancement_factor': args.enhancement_factor,
        'sample_rate': args.sample_rate,
        'segment_duration': args.segment_duration,
        'max_workers': args.max_workers,
        'use_segments': args.use_segments
    }
    
    return config

def main():
    start_time = time.time()
    
    # 解析命令行参数
    config = parse_arguments()
    
    # 创建并运行批处理转换器
    batch_converter = BatchConverter(config)
    batch_converter.batch_convert()
    
    # 打印处理时间
    elapsed_time = time.time() - start_time
    print(f"\nTotal execution time: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    main()