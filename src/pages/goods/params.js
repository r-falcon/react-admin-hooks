import React, { useState } from 'react'
import useSyncCallback from '../useSyncCallback'

function Params() {
  const [state, setState] = useState(0)

  const setT = () => {
    setState(2)
    func()
  }

  const func = useSyncCallback(() => {
    console.log(state)
  })

  return (
    <div>
      <button onClick={setT}>set 2</button>
    </div>
  )
}

Params.displayName = 'Params'
export default Params
