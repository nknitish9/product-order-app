import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor() {}

  // Using Web Speech API
  speakText(text: string): void {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
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

  // Stop any ongoing speech
  stopSpeech(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}