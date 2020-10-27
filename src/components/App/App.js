import React from 'react';
import './App.css';

class App extends React.Component{

  constructor(props){
     super(props);

     this.state = {
       session: 25,
       break: 5,
       segs: 0,//seconds
       isSession: true,
       isRunning: false,
       iconPlay: "fa-play"
     }

     this.incrementSession = this.incrementSession.bind(this);
     this.incrementBreak = this.incrementBreak.bind(this);
     this.decrementSession = this.decrementSession.bind(this);
     this.decrementBreak = this.decrementBreak.bind(this);
     this.start = this.start.bind(this);
     this.stop = this.stop.bind(this);
     this.resetDefault = this.resetDefault.bind(this);
     this.run_stop = this.run_stop.bind(this);
     this.playAudio = this.playAudio.bind(this);
     this.stopAudio = this.stopAudio.bind(this);
  }

  incrementSession(){
     if(this.state.isRunning){
        return;
     }
     this.setState((state)=>{
        let session = state.session + 1 > 60 ? 60 : state.session + 1;
        return {
           session
        }
     });
  }

  incrementBreak(){
   if(this.state.isRunning){
      return;
   }
    this.setState((state)=>{
      let bre = state.break + 1 > 60 ? 60 : state.break + 1;
       return {
          break: bre,
       }
    });
 }
 decrementSession(){
   if(this.state.isRunning){
      return;
   }
    this.setState((state)=>{
     let session = state.session - 1? state.session -1 : 1; 
     return {
       session
     }
   });
 }

 decrementBreak(){
   if(this.state.isRunning){
      return;
   }
  this.setState((state)=>{
   let bre = state.break - 1 ? state.break - 1 : 1;
   return {
     break: bre,
     currentBreak: bre
   }
 });
}

start(){
     this.interval_ID = setInterval(()=>{
        this.setState((state)=>{
          let min = state.isSession ? state.session : state.break;
         if(min === 0 && state.segs === 0){
            if(state.isSession){
               this.stop();
               this.resetSession();
               this.start();
            }else{
               this.stop();
               this.resetBreak();
               this.start();
            }
            return {};
          }
         min = state.segs === 0? min - 1 : min;
         let segs = state.segs - 1;
         segs = segs < 0? 59 : segs;

         if(min === 0 && state.segs === 2){
            setTimeout(this.playAudio, 1000);
          }

          return state.isSession ? {segs, session : min, isRunning: true} : {segs, break : min, isRunning: true}
        });

     }, 1000);
}


run_stop(){
    if(this.state.isRunning){
       this.stop();
       this.setState({iconPlay: "fa-play"});
    }else{
       this.start();
       this.setState({iconPlay: "fa-pause"});
    }
}


stop(){
   clearInterval(this.interval_ID);
   this.setState({isRunning : false});
}

resetSession(){
   this.setState(state => {
      return {
         isSession: false,
         session: 25,
         segs : 0
      }
   })
}

resetBreak(){
   this.setState(state => {
       return {
          isSession: true,
          break: 5,
          segs : 0
       }
   });
}

resetDefault(){
   this.stop();
   this.setState(state => {
      return {
         isSession: true,
         session: 25,
         break: 5,
         segs : 0,
         iconPlay: "fa-play"
      }
  });
  this.stopAudio();
}

playAudio(){
   document.getElementById("beep").play();
}

stopAudio(){
   const AUDIO = document.getElementById("beep");
   AUDIO.pause();
   AUDIO.currentTime = 0;
}

  render(){
        let time = "";
        if(this.state.isSession){
            let seg = this.state.segs < 10 ? `0${this.state.segs}`: this.state.segs;
            let min = this.state.session < 10 ? `0${this.state.session}` : this.state.session;
            time = `${min}:${seg}`;
        }else{
            let seg = this.state.segs < 10 ? `0${this.state.segs}`: this.state.segs;
            let min = this.state.break < 10 ? `0${this.state.break}` : this.state.break;
            time = `${min}:${seg}`;          
        }
    return (
      <div className="container">
         <h1 className="title">Pomodoro</h1>
        <div className="container-flex">
            <div className="row">
               <p id="session-label" className="label">Session</p>
               <div className="controls-container">
                  <button 
                        id="session-decrement"
                        onClick={this.decrementSession}>
                     <i className="fas fa-minus"></i>
                  </button>
                  <p id="session-length" ><span>{this.state.session}</span></p>
                  <button 
                        id="session-increment"
                        onClick={this.incrementSession}>
                     <i className="fas fa-plus"></i>
                  </button>
               </div>
               <p>min</p>
            </div>
            <div className="row">
            <p id="break-label" className="label">Break</p>
               <div className="controls-container">
                  <button 
                         id="break-decrement"
                         onClick={this.decrementBreak}>
                      <i className="fas fa-minus"></i>
                  </button>
                  <p id="break-length"><span>{this.state.break}</span></p>
                  <button 
                         id="break-increment"
                         onClick={this.incrementBreak}>
                      <i className="fas fa-plus"></i>
                  </button>
               </div>
               <p>min</p>
            </div>
            <div className="row">
                <div className="cicle-time">
                 <h2 id="timer-label" className="label">{ this.state.isSession? "Session" : "Break" }</h2>
                 <p id="time-left">{ time }</p>
                </div>
            </div>
            <div className="row">
                 <div className="container-controls">
                     <button 
                            id="start_stop"
                            onClick={
                               ()=>{
                                  this.run_stop();
                                  }}><i className={`fas ${this.state.iconPlay}`}></i></button>
                     { /*fas fa-pause  */} 
                      <button 
                             id="reset"
                             onClick={this.resetDefault}>
                         <i className="fas fa-sync-alt"></i>
                      </button>
                 </div>
            </div>
        </div>
        <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep"/>
      </div>
    );
  }

}

export default App;
