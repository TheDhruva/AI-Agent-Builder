import React from 'react'
import CreateAgentSection from './_components/CreateAgentSection'
import AiAgentsTab from './_components/AiAgentsTab'

function Dashboard() {
  return (
    <div className='flex-vertical '>
      <CreateAgentSection />
      <AiAgentsTab />
    </div>
  )
}

export default Dashboard