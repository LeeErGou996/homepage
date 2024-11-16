from pathlib import Path
from pydub import AudioSegment

class AudioSegmenter:
    def __init__(self, segment_duration=30):
        self.segment_duration = segment_duration * 1000  # Convert to milliseconds
        
    def segment_audio(self, input_file):
        """Split audio file into segments"""
        try:
            audio = AudioSegment.from_file(str(input_file))
            segment_paths = []
            
            # Create temp directory
            temp_dir = Path('./temp') / input_file.stem
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            # Segmentation
            for i in range(0, len(audio), self.segment_duration):
                segment = audio[i:i + self.segment_duration]
                segment_path = temp_dir / f'segment_{i//self.segment_duration}.mp3'
                segment.export(str(segment_path), format='mp3')
                segment_paths.append(segment_path)
                
            return segment_paths
            
        except Exception as e:
            raise Exception(f"Error segmenting audio: {str(e)}")

    def merge_segments(self, segment_paths, output_path):
        """Merge processed audio segments"""
        try:
            combined = AudioSegment.empty()
            for path in segment_paths:
                segment = AudioSegment.from_file(str(path))
                combined += segment
            combined.export(str(output_path), format='mp3')
            return True
        except Exception as e:
            raise Exception(f"Error merging segments: {str(e)}")
