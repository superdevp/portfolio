import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border-border">
            <CardContent className="p-12">
              <h1 className="text-6xl font-bold text-teal-400 mb-4">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
              <p className="text-muted-foreground mb-8">
                Sorry, the project you're looking for doesn't exist or has been moved.
              </p>
              <Link href="/projects">
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
