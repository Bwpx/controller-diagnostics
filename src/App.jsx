import { useEffect, useState } from "react";

function Stick({x,y,label}){

  const radius = 90

  const dotX = x*radius
  const dotY = y*radius

  return(

    <div style={{textAlign:"center"}}>

      <h4 style={{color:"#e2e8f0",marginBottom:"10px"}}>{label}</h4>

      <div style={{
        width:radius*2,
        height:radius*2,
        border:"2px solid #334155",
        borderRadius:"50%",
        margin:"auto",
        position:"relative"
      }}>

        <div style={{
          position:"absolute",
          top:"50%",
          width:"100%",
          height:"1px",
          background:"#334155"
        }}/>

        <div style={{
          position:"absolute",
          left:"50%",
          height:"100%",
          width:"1px",
          background:"#334155"
        }}/>

        <div style={{
          width:12,
          height:12,
          background:"#3b82f6",
          borderRadius:"50%",
          position:"absolute",
          left:radius + dotX - 6,
          top:radius + dotY - 6,
          boxShadow:"0 0 8px #3b82f6"
        }}/>

      </div>

      <div style={{
        fontSize:"12px",
        marginTop:"10px",
        color:"#94a3b8"
      }}>
        X: {x.toFixed(3)} <br/>
        Y: {y.toFixed(3)}
      </div>

    </div>

  )
}

function App(){

  const [lx,setLX]=useState(0)
  const [ly,setLY]=useState(0)
  const [rx,setRX]=useState(0)
  const [ry,setRY]=useState(0)

  const [controller,setController]=useState("None detected")

  useEffect(()=>{

    const update=()=>{

      const gp=navigator.getGamepads()[0]

      if(gp){

        setController(gp.id)

        setLX(gp.axes[0])
        setLY(gp.axes[1])
        setRX(gp.axes[2])
        setRY(gp.axes[3])

      }

      requestAnimationFrame(update)

    }

    update()

  },[])

  return(

    <div style={{
      background:"#0f172a",
      minHeight:"100vh",
      fontFamily:"system-ui",
      padding:"40px",
      color:"#f1f5f9"
    }}>

      <div style={{
        maxWidth:"900px",
        margin:"auto",
        background:"#1e293b",
        padding:"30px",
        borderRadius:"10px",
        boxShadow:"0 10px 30px rgba(0,0,0,.4)"
      }}>

        <h1 style={{
          marginBottom:"5px",
          fontWeight:"600",
          letterSpacing:"0.5px"
        }}>
          Gamepad Analyzer
        </h1>

        <div style={{
          fontSize:"13px",
          color:"#94a3b8",
          marginBottom:"25px"
        }}>
          Controller: {controller}
        </div>

        <div style={{
          display:"flex",
          justifyContent:"space-around",
          marginBottom:"35px"
        }}>

          <Stick x={lx} y={ly} label="Left Stick"/>
          <Stick x={rx} y={ry} label="Right Stick"/>

        </div>

        <div style={{
          marginTop:"20px",
          padding:"18px",
          background:"#0f172a",
          borderRadius:"8px",
          fontSize:"14px",
          border:"1px solid #334155"
        }}>

          <strong style={{color:"#e2e8f0"}}>
            Student Project
          </strong>

          <p style={{
            marginTop:"8px",
            color:"#94a3b8",
            lineHeight:"1.5"
          }}>
            Created by Martin Gonzalez, Computer Science student.
            This project visualizes controller input using the
            Web Gamepad API and React. It displays real-time
            analog stick movement for debugging and hardware testing.
          </p>

        </div>

      </div>

    </div>

  )
}

export default App

