import React , { useState } from 'react';
import { useRef } from 'react';
import { ReactFlow } from 'reactflow';
import './App.css';
import Acc from './components/Acc';
import Gyro from './components/Gyro';
import Video from './components/Video';
import Report from './components/report';
import Processing from './components/processing';
import Frquency from './components/Frquency';
import Repcount from './components/Repcount';
import useClickTracker from "./hooks/clicktracker";
import useArrowConnect from './hooks/connectgraph';

function App() {
  
const clickedElements =useClickTracker();


const handleClick = () => {
  const modalitiess: string[] = [];
  const reports: string[] = [];
  const method: { [key: string]: string } = {};
  const hasAcc = clickedElements.some(element => element.id.includes('Acc'));
  const hasModel = clickedElements.some(element => element.id.includes('CNN_LSTM'));
  const hasreport= clickedElements.some(element => element.id.includes('report'));
  const hasfreq= clickedElements.some(element => element.id.includes('Frquency'));
  const hascount= clickedElements.some(element => element.id.includes('Repcount'));

  let Ensamble= false
  let Model=''

  if(hasAcc)
  {
    modalitiess.push("acc");
  }
  if(hascount)
  {
    reports.push("rep_count");
  }
  if(hasfreq)
  {
    reports.push("freq");
  }
  if(hasreport)
  {
    reports.push("classification ");
  }
  
  const hasGry = clickedElements.some(element => element.id.includes('Gyro'));
  
  if(hasGry)
  {
    modalitiess.push("gyro");
  }

  const video = clickedElements.some(element => element.id.includes('Video'));
  if(video)
  {
    modalitiess.push("pose");
  }
  if(hasAcc||hasGry && video)
  {
    Ensamble= true
  }
  if(hasModel && video)
  {
    Model= "cnn-lstm";
    method['pose'] = "cnn-lstm"
  }
  if(hasModel && hasAcc || hasModel && hasGry)
  {
    Model= "cnn-lstm";
    method['sensor'] = "cnn-lstm"
  }
 
  const jsonData = JSON.stringify({"modalities": modalitiess,
  "processing": {method, "ensemble": Ensamble},
  "report": reports});
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.json';
  link.click();
  URL.revokeObjectURL(url);

};

  return (
    
    <main>
      <form method="POST">
      <div className="container">
      <div  className="rightcontainer">
      <div  className="reportcontainer">
      
      <p>Clicked Elements:</p>
      <ul>
        {
          
        clickedElements.map((element, index) => (
          <li key={index}>
            {element.tagName}
            {element.id && `#${element.id}`}
            {element.classList && element.classList.join('.')}
          </li>
        ))}
      </ul>

      </div> 
      <div  className="inputcontainer">
      
      <p>Input Elements:</p>
      
      </div> 

      <div  className="processingcontainer">
      
      <p>Processing Elements:</p>
      

      </div> 

      <div  className="outputcontainer">
      
      <p>Output Elements:</p>
      

      </div> 

      </div>
      <div  className="leftcontainer"> 
      <Acc /> <br></br>
      <span id='text'>Gyroscope</span>
      <Gyro /><br></br><br></br><br></br>
      <span id='text'>Video</span>
      <Video /><br></br><br></br><br></br>
      <span id='text'>Accelerometer</span>
      <Report/><br></br><br></br><br></br> <br></br>
      <span id='text'>CNN-LSTM Model</span>
      <Processing/><br></br><br></br><br></br><br></br>
      <span id='text'> Classification Report</span>
      <Frquency/><br></br><br></br><br></br><br></br>
      <span id='text'> Frquency Report</span>
      <Repcount/><br></br><br></br><br></br><br></br>
      <span id='text'> Repeatition counting Report</span>
      </div>
      
        
      </div>
      </form>
      <button onClick={handleClick} className="button">Generate code</button>

    </main>
    
  );
}

export default App;



// // import ReactFlow, { Controls, Background } from 'reactflow';
// // import 'reactflow/dist/style.css';

// // const nodes = [
// //   {
// //     id: '1',
// //     data: { label: 'Hello' },
// //     position: { x: 0, y: 0 },
// //     type: 'input',
// //   },
// //   {
// //     id: '2',
// //     data: { label: 'World' },
// //     position: { x: 100, y: 100 },
// //   },
// // ];

// // function Flow() {
// //   console.log("fhaslfhasjk")
// //   return (
// //     <div style={{ height: '100%' }}>
// //       <ReactFlow nodes={nodes}>
// //         <Background />
// //         <Controls />
// //       </ReactFlow>
// //     </div>
// //   );
// // }

// // export default Flow;



// import React from 'react';

// const App = () => {
  // const handleClick = () => {
  //   const jsonData = JSON.stringify({ key1: 'value1' });
  //   const blob = new Blob([jsonData], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'data.json';
  //   link.click();
  //   URL.revokeObjectURL(url);
  // };

//   return (
//     <div>
//       <button onClick={handleClick}>Save JSON</button>
//     </div>
//   );
// };

// export default App;
