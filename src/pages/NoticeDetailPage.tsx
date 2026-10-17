import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Bell, CalendarDays, Pin } from "lucide-react"
import { Card, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { noticesMock } from "../data/mock"

export default function NoticeDetailPage() {
  const { id } = useParams()
  const notice = noticesMock.find((item) => item.id === Number(id))
  if (!notice) return <section className="mx-auto max-w-3xl space-y-4"><h1 className="text-3xl font-semibold">Notice not found</h1><p className="text-muted-foreground">This notice may have been removed.</p><Link to="/notices" className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> Back to notices</Link></section>
  return <article className="mx-auto max-w-3xl space-y-6"><Link to="/notices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All notices</Link><Card><CardContent className="space-y-5 p-6 sm:p-8"><div className="flex items-center gap-2"><Badge variant="outline">{notice.type}</Badge>{notice.isImportant && <Badge variant="destructive"><Pin className="mr-1 h-3 w-3" /> Important</Badge>}</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{notice.title}</h1><p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" /> Published {notice.date} · Silver Oak University</p><div className="border-t pt-5 leading-7 text-muted-foreground"><p>Students are advised to review this campus update and plan accordingly. For additional information, contact the relevant department or Student Affairs office.</p></div><p className="flex items-center gap-2 text-xs text-muted-foreground"><Bell className="h-4 w-4" /> Campus Communications</p></CardContent></Card></article>
}
