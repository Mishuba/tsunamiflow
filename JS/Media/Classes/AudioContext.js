export class TsunamiSounds {
      constructor () {
            this.context = null;
            this.processing = null;
            this.id = null;
            this.source;
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
      ElementSource(element){
            this.source = this.context.createMediaElementSource(element);
      }
      finish() {
            this.context.close();
      }
      
}