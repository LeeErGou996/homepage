import numpy as np
from scipy import signal
import torch
import os
import warnings

# 设置环境变量来解决OpenMP警告
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

# 忽略特定警告
warnings.filterwarnings("ignore", category=UserWarning)

class AudioProcessor:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        # 初始化Whisper模型（可选）
        self.use_whisper = False  # 默认不使用Whisper
        self.whisper_model = None
        self.whisper_processor = None

    def initialize_whisper(self):
        """
        仅在需要时初始化Whisper模型
        """
        if not self.use_whisper:
            try:
                from transformers import WhisperProcessor, WhisperForConditionalGeneration
                print("Loading Whisper model...")
                self.whisper_processor = WhisperProcessor.from_pretrained("openai/whisper-base")
                self.whisper_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base").to(self.device)
                self.use_whisper = True
                print("Whisper model loaded successfully")
            except Exception as e:
                print(f"Warning: Could not initialize Whisper model: {e}")
                self.use_whisper = False

    def analyze_speech_segments(self, audio):
        """
        使用简单的能量检测来分析语音片段
        """
        # 使用简单的能量检测而不是Whisper
        frame_length = int(0.025 * self.sample_rate)  # 25ms frames
        energy = np.array([sum(audio[i:i + frame_length]**2) 
                          for i in range(0, len(audio), frame_length)])
        
        # 归一化能量
        energy = energy / np.max(energy)
        
        # 使用中值滤波平滑结果
        energy = signal.medfilt(energy, 5)
        
        # 将能量值扩展到原始音频长度
        speech_mask = np.interp(
            np.linspace(0, len(energy), len(audio)),
            np.arange(len(energy)),
            energy
        )
        
        return speech_mask

    def apply_frequency_filter(self, audio, cutoff_freq, filter_type='high'):
        """
        应用频率滤波器
        """
        nyquist = self.sample_rate / 2
        normalized_cutoff_freq = cutoff_freq / nyquist
        
        # 创建滤波器
        b, a = signal.butter(2, normalized_cutoff_freq, btype=filter_type)
        
        # 应用滤波器
        return signal.lfilter(b, a, audio)


    def process_audio(self, audio):
        """
        基本音频处理
        """
        # 应用高通滤波器去除低频
        whispered = self.apply_frequency_filter(audio, 800, 'high')
        
        # 规范化音量
        whispered = whispered / np.max(np.abs(whispered))
        
        # 降低音量以防失真
        whispered = whispered * 0.95
        
        return whispered

    def process_audio_with_parameters(self, audio, cutoff_freq=300, volume=0.95, 
                                    enhancement_factor=1.2):
        """
        使用可自定义参数的处理
        """
        try:
            # 应用高通滤波器
            whispered = self.apply_frequency_filter(audio, cutoff_freq, 'high')
            
            # 应用高频增强
            nyquist = self.sample_rate / 2
            high_freq_cutoff = 2000 / nyquist
            whispered_high = self.apply_frequency_filter(whispered, high_freq_cutoff, 'high')
            whispered = whispered + (whispered_high * (enhancement_factor - 1))
            

            
            return whispered
            
        except Exception as e:
            print(f"Error in audio processing: {e}")
            return audio  # 返回原始音频作为后备