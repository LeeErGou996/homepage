import os
import numpy as np
from pydub import AudioSegment

class AudioLoader:
    def __init__(self):
        self.supported_formats = ['.mp3', '.wav', '.m4a', '.ogg']
        
    def load_audio(self, file_path):
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext not in self.supported_formats:
            raise ValueError(f"Unsupported file format. Supported formats: {self.supported_formats}")
        
        try:
            audio = AudioSegment.from_file(file_path)
            
            self.original_frame_rate = audio.frame_rate
            self.original_channels = audio.channels
            self.original_sample_width = audio.sample_width
            
            samples = np.array(audio.get_array_of_samples())
            
            if audio.channels == 2:
                samples = samples.reshape(-1, 2)
            
            self.samples = samples
            
            return self.samples
            
        except Exception as e:
            raise Exception(f"Error loading audio file: {str(e)}")

    def save_audio(self, samples, output_file, speed_factor=1.0):
        try:
            new_frame_rate = int(self.original_frame_rate * speed_factor)
            
            if self.original_sample_width == 2:
                samples = samples.astype(np.int16)
            elif self.original_sample_width == 4:
                samples = samples.astype(np.int32)
            
            if self.original_channels == 2 and len(samples.shape) == 2:
                samples = samples.reshape(-1)
            
            audio_segment = AudioSegment(
                samples.tobytes(),
                frame_rate=new_frame_rate,
                sample_width=self.original_sample_width, 
                channels=self.original_channels
            )
            
            audio_segment.export(output_file, format="mp3")
            
        except Exception as e:
            raise Exception(f"Error saving audio: {str(e)}")