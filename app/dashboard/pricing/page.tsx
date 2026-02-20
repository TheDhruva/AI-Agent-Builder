import { PricingTable } from '@clerk/nextjs'
import React from 'react'

/**
 * NOTE: Before this works, you MUST:
 * 1. Go to Clerk Dashboard -> Billing.
 * 2. Connect your Stripe account.
 * 3. Create a "Pricing Table" in Clerk and get the 'slug'.
 */

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Upgrade Your AI Workforce
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Choose a plan to increase your agent tokens and unlock premium tools.
          </p>
        </div>

        <div className="w-full">
          {/* The 'slug' prop is mandatory if you want to use the 
            pre-configured table from the Clerk Dashboard.
          */}
          <PricingTable />
        </div>
      </div>
    </div>
  )
}