export class TsunamiSounds {
      constructor () {
            this.context = null;
            this.processing = null;
            this.id = null;
      }
      create() {
            if(this.context === null) {
                  this.context = new AudioContext();
                  this.processing = this.context.baseLatency;
                  this.output = this.context.outputLatency;
            } else {
                  return this.context;
            }
      }
      finish() {
            this.context.close();
      }
      
}