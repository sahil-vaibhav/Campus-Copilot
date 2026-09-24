import React from "react"
import { Card, CardContent } from "../components/ui/Card"
import { servicesMock } from "../data/mock"
import { Building2 } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campus Services</h1>
        <p className="text-muted-foreground">Access essential campus facilities and services.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesMock.map(service => (
          <Card key={service.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
