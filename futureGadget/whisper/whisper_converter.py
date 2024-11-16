import os
import time
import numpy as np
from scipy import signal
from scipy.io import wavfile
import librosa
import soundfile as sf
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
import pydub
from pydub import AudioSegment
import tempfile
import shutil

class WhisperVoiceConverter:
    def __init__(self):
        self.sample_rate = 44100
        self.frame_length = 2048
        self.hop_length = 512
        self.supported_formats = ['.mp3', '.wav', '.m4a', '.ogg']
        
    def load_audio(self, file_path):
        """Load audio file in various formats and convert to normalized numpy array"""
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext not in self.supported_formats:
            raise ValueError(f"Unsupported file format. Supported formats: {self.supported_formats}")
        
        try:
            if file_ext == '.mp3':
                audio_segment = AudioSegment.from_mp3(file_path)
                samples = np.array(audio_segment.get_array_of_samples(), dtype=np.float32)
                if audio_segment.channels == 2:
                    samples = np.mean(samples.reshape(-1, 2), axis=1)
                samples = samples / (2**15 if samples.dtype == np.int16 else 1)
                return samples
            else:
                audio, sr = librosa.load(file_path, sr=self.sample_rate)
                return audio
        except Exception as e:
            raise Exception(f"Error loading audio file: {str(e)}")
            
    def save_audio(self, audio, output_file):
        """Save processed audio"""
        try:
            audio = np.float32(audio)
            audio = np.clip(audio, -1, 1)
            audio_segment = AudioSegment(
                audio.tobytes(), 
                frame_rate=self.sample_rate,
                sample_width=2, 
                channels=1
            )
            audio_segment.export(output_file, format="mp3")
        except Exception as e:
            raise Exception(f"Error saving audio: {str(e)}")

    def process_audio(self, audio):
        """Process audio with all effects"""
        # 降低音量
        audio = audio * 0.8
        
        # 添加呼吸声特效
        noise = np.random.normal(0, 0.005, len(audio))
        audio = audio + noise
        
        # 高频增强
        b, a = signal.butter(4, 0.5, btype='high')
        audio = signal.filtfilt(b, a, audio)
        
        return audio

    def convert_to_whisper(self, input_file, output_file):
        """Main conversion pipeline"""
        try:
            audio = self.load_audio(input_file)
            audio = self.process_audio(audio)
            self.save_audio(audio, output_file)
            return True
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            return False

class BatchWhisperConverter:
    def __init__(self, segment_duration=30):
        self.converter = WhisperVoiceConverter()
        self.supported_formats = self.converter.supported_formats
        self.processed_files = []
        self.failed_files = []
        self.segment_duration = segment_duration * 1000  # 转换为毫秒
        
    def setup_directories(self):
        """创建必要的目录结构"""
        directories = {
            'input': Path('./input'),
            'output': Path('./output'),
            'logs': Path('./logs'),
            'temp': Path('./temp')
        }
        
        for dir_path in directories.values():
            dir_path.mkdir(parents=True, exist_ok=True)
            
        return directories
        
    def get_audio_files(self, input_dir):
        """获取输入目录中所有支持的音频文件"""
        audio_files = []
        for fmt in self.supported_formats:
            audio_files.extend(list(Path(input_dir).glob(f'*{fmt}')))
        return audio_files
        
    def create_output_path(self, input_file, output_dir):
        """创建输出文件路径"""
        output_name = f'whispered_{input_file.name}'
        return output_dir / output_name

    def segment_audio(self, input_file):
        """将音频文件分割成小段"""
        try:
            audio = AudioSegment.from_file(str(input_file))
            segments = []
            segment_paths = []
            
            # 创建临时目录
            temp_dir = Path('./temp') / input_file.stem
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            # 分段
            for i in range(0, len(audio), self.segment_duration):
                segment = audio[i:i + self.segment_duration]
                segment_path = temp_dir / f'segment_{i//self.segment_duration}.mp3'
                segment.export(str(segment_path), format='mp3')
                segment_paths.append(segment_path)
                
            return segment_paths
            
        except Exception as e:
            raise Exception(f"Error segmenting audio: {str(e)}")

    def merge_segments(self, segment_paths, output_path):
        """合并处理后的音频片段"""
        try:
            combined = AudioSegment.empty()
            for path in segment_paths:
                segment = AudioSegment.from_file(str(path))
                combined += segment
            combined.export(str(output_path), format='mp3')
            return True
        except Exception as e:
            raise Exception(f"Error merging segments: {str(e)}")

    def process_single_file(self, input_file, output_file):
        """处理单个文件"""
        try:
            # 分段处理
            segment_paths = self.segment_audio(input_file)
            processed_segments = []
            
            # 处理每个片段
            for segment_path in segment_paths:
                processed_path = segment_path.parent / f'processed_{segment_path.name}'
                if self.converter.convert_to_whisper(str(segment_path), str(processed_path)):
                    processed_segments.append(processed_path)
                else:
                    raise Exception(f"Failed to process segment {segment_path}")
                    
            # 合并片段
            success = self.merge_segments(processed_segments, output_file)
            
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
                
            if success:
                return True, input_file, None
            return False, input_file, "Merge failed"
            
        except Exception as e:
            return False, input_file, str(e)
            
    def log_results(self, log_dir):
        """记录处理结果"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = log_dir / f'conversion_log_{timestamp}.txt'
        
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write(f"Whisper Voice Conversion Log - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("-" * 80 + "\n\n")
            
            f.write("Successfully processed files:\n")
            for file in self.processed_files:
                f.write(f"✓ {file}\n")
            
            if self.failed_files:
                f.write("\nFailed conversions:\n")
                for file, error in self.failed_files:
                    f.write(f"✗ {file}: {error}\n")
                    
            f.write(f"\nTotal processed: {len(self.processed_files)}")
            f.write(f"\nTotal failed: {len(self.failed_files)}")
            
        return log_file
            
    def batch_convert(self, max_workers=4):
        """批量处理所有文件"""
        print("Starting batch conversion process...")
        
        # 设置目录
        dirs = self.setup_directories()
        print(f"Directories initialized: {', '.join(dirs.keys())}")
        
        # 获取所有音频文件
        audio_files = self.get_audio_files(dirs['input'])
        if not audio_files:
            print("No supported audio files found in input directory!")
            return
        
        print(f"\nFound {len(audio_files)} audio files to process")
        print("Supported formats:", ", ".join(self.supported_formats))
        
        # 创建进度条
        pbar = tqdm(total=len(audio_files), desc="Converting files")
        
        # 使用线程池进行并行处理
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
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
                    self.processed_files.append(input_file.name)
                else:
                    self.failed_files.append((input_file.name, error))
                pbar.update(1)
        
        pbar.close()
        
        # 清理临时目录
        try:
            shutil.rmtree(dirs['temp'])
        except:
            pass
        
        # 记录结果
        log_file = self.log_results(dirs['logs'])
        
        # 打印最终结果
        print("\nConversion process completed!")
        print(f"Successfully processed: {len(self.processed_files)} files")
        print(f"Failed: {len(self.failed_files)} files")
        print(f"\nDetailed log saved to: {log_file}")
        
        if self.failed_files:
            print("\nFailed files:")
            for file, error in self.failed_files:
                print(f"- {file}: {error}")

def main():
    start_time = time.time()
    
    # 可以调整这些参数
    segment_duration = 5  # 分段长度（秒）
    max_workers = 4      # 并行处理数量
    
    batch_converter = BatchWhisperConverter(segment_duration=segment_duration)
    batch_converter.batch_convert(max_workers=max_workers)
    
    elapsed_time = time.time() - start_time
    print(f"\nTotal execution time: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    main()