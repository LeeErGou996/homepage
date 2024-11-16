import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import argparse
from pathlib import Path
from scipy import signal

class FrequencyAnalyzer:
    def __init__(self, file_path):
        """
        初始化频率分析器
        
        Parameters:
        file_path (str): MP3文件的路径
        """
        self.file_path = file_path
        self.y = None  # 音频时间序列
        self.sr = None  # 采样率
        self.duration = None  # 音频时长
        
    def load_audio(self):
        """加载音频文件并获取基本信息"""
        try:
            self.y, self.sr = librosa.load(self.file_path)
            self.duration = librosa.get_duration(y=self.y, sr=self.sr)
            print(f"音频文件加载成功:")
            print(f"采样率: {self.sr} Hz")
            print(f"时长: {self.duration:.2f} 秒")
            print(f"采样点数: {len(self.y)}")
            print(f"Nyquist频率: {self.sr/2} Hz")
            return True
        except Exception as e:
            print(f"加载音频文件时出错: {str(e)}")
            return False
    
    def plot_frequency_analysis(self, output_path=None):
        """
        绘制频率分析图
        
        Parameters:
        output_path (str, optional): 保存图片的路径
        """
        if self.y is None:
            print("请先加载音频文件!")
            return
            
        # 创建子图
        plt.figure(figsize=(15, 15))
        
        # 1. 波形图
        plt.subplot(4, 1, 1)
        librosa.display.waveshow(self.y, sr=self.sr)
        plt.title('波形图')
        plt.xlabel('时间 (秒)')
        plt.ylabel('振幅')
        
        # 2. 短时傅里叶变换(STFT)频谱图
        plt.subplot(4, 1, 2)
        D = librosa.amplitude_to_db(np.abs(librosa.stft(self.y)), ref=np.max)
        librosa.display.specshow(D, y_axis='log', x_axis='time', sr=self.sr)
        plt.colorbar(format='%+2.0f dB')
        plt.title('频谱图 (STFT)')
        
        # 3. 功率谱密度
        plt.subplot(4, 1, 3)
        frequencies, times, Sxx = signal.spectrogram(self.y, self.sr)
        plt.pcolormesh(times, frequencies, 10 * np.log10(Sxx))
        plt.ylabel('频率 [Hz]')
        plt.xlabel('时间 [秒]')
        plt.title('功率谱密度')
        plt.colorbar(label='功率/频率 (dB/Hz)')
        
        # 4. 梅尔频谱图
        plt.subplot(4, 1, 4)
        mel_spect = librosa.feature.melspectrogram(y=self.y, sr=self.sr)
        mel_spect_db = librosa.power_to_db(mel_spect, ref=np.max)
        librosa.display.specshow(mel_spect_db, y_axis='mel', x_axis='time', sr=self.sr)
        plt.colorbar(format='%+2.0f dB')
        plt.title('梅尔频谱图')
        
        plt.tight_layout()
        
        if output_path:
            plt.savefig(output_path)
            print(f"图像已保存到: {output_path}")
        else:
            plt.show()
            
    def analyze_frequency_features(self):
        """分析频率特征"""
        if self.y is None:
            print("请先加载音频文件!")
            return
            
        # 计算频率特征
        # 1. 频谱质心
        cent = librosa.feature.spectral_centroid(y=self.y, sr=self.sr)[0]
        
        # 2. 频谱带宽
        bandwidth = librosa.feature.spectral_bandwidth(y=self.y, sr=self.sr)[0]
        
        # 3. 频谱滚降点
        rolloff = librosa.feature.spectral_rolloff(y=self.y, sr=self.sr)[0]
        
        # 4. 过零率
        zero_crossing = librosa.feature.zero_crossing_rate(self.y)[0]
        
        # 5. 基频估计
        f0, voiced_flag, voiced_probs = librosa.pyin(self.y, 
                                                    fmin=librosa.note_to_hz('C2'), 
                                                    fmax=librosa.note_to_hz('C7'))
        f0 = f0[~np.isnan(f0)]  # 移除NaN值
        
        print("\n频率特征分析结果:")
        print(f"频谱质心(平均): {np.mean(cent):.2f} Hz")
        print(f"频谱带宽(平均): {np.mean(bandwidth):.2f} Hz")
        print(f"频谱滚降点(平均): {np.mean(rolloff):.2f} Hz")
        print(f"过零率(平均): {np.mean(zero_crossing):.4f}")
        if len(f0) > 0:
            print(f"基频(平均): {np.mean(f0):.2f} Hz")
            print(f"基频(范围): {np.min(f0):.2f} Hz - {np.max(f0):.2f} Hz")
        
        # 6. 计算主要频率成分
        D = np.abs(librosa.stft(self.y))
        freqs = librosa.fft_frequencies(sr=self.sr)
        
        # 找出能量最强的前5个频率
        mean_spectrum = np.mean(D, axis=1)
        top_freq_idx = np.argsort(mean_spectrum)[-5:][::-1]
        
        print("\n主要频率成分:")
        for idx, freq_idx in enumerate(top_freq_idx, 1):
            print(f"第{idx}强频率: {freqs[freq_idx]:.2f} Hz")

def main():
    parser = argparse.ArgumentParser(description='MP3文件频率分析工具')
    parser.add_argument('input_file', help='输入的MP3文件路径')
    parser.add_argument('--output', '-o', help='输出图像的路径(可选)')
    args = parser.parse_args()
    
    analyzer = FrequencyAnalyzer(args.input_file)
    
    if analyzer.load_audio():
        analyzer.plot_frequency_analysis(args.output)
        analyzer.analyze_frequency_features()

if __name__ == "__main__":
    main()