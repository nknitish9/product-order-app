import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor() {}

  speakText(text: string): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US') || null;
      
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
      alert('Text-to-speech is not supported in this browser');
    }
  }

  stopSpeech(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}