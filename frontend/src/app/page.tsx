'use client'
import Auth from '@/components/auth'
import AdminDashboard from '@/components/dashboard/adminDashboard'
import { AgentDashboard } from '@/components/dashboard/agentDashboard'
import { CustomerDashboard } from '@/components/dashboard/customerDashboard'
import { useState } from 'react'

export default function Home() {

  //props drilling bad I know
  const [role, setRole] = useState<string>('')

  let dashboardComponent;
  switch (role) {
    case 'agent':
      dashboardComponent = <AgentDashboard />;
      break;
    case 'customer':
      dashboardComponent = <CustomerDashboard />;
      break;
    case 'admin':
      dashboardComponent = <AdminDashboard />;
      break;
    default:
      dashboardComponent = <h1> please select a role </h1>;
      break;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello {role}</h1>
      {dashboardComponent}
      <Auth setRole={setRole}></Auth>
    </main>
  )
}
