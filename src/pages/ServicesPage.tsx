import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { servicesMock } from "../data/mock"
import { cn } from "../lib/utils"
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Search,
  Laptop,
} from "lucide-react"
import {
  type ServiceItem,
  SERVICE_META,
  computeServiceStatus,
} from "../data/servicesConfig"

export default function ServicesPage({ initialTime }: { initialTime?: Date } = {}) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [ticketQuery, setTicketQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Live campus clock that updates every 10 seconds
  const [now, setNow] = useState(() => initialTime ?? new Date())
  useEffect(() => {
    if (initialTime) return
    const timer = setInterval(() => {
      setNow(new Date())
    }, 10000)
    return () => clearInterval(timer)
  }, [initialTime])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Precompute live status for all services
  const servicesWithStatus = useMemo(() => {
    return servicesMock.map((service) => {
      const meta = SERVICE_META[service.id] || {
        icon: Laptop,
        timing: "09:00 AM – 05:00 PM",
        location: "Campus Main Building",
        contact: "info@silveroak.edu",
        schedule: {
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
          daysDescription: "Mon – Fri: 09:00 AM – 05:00 PM",
          openBadge: "Open Now",
          closedBadge: "Closed",
        },
        highlights: ["Campus assistance", "Student guidance"],
        actionLabel: "View Details",
      }
      const status = computeServiceStatus(meta.schedule, now)
      return {
        service,
        meta,
        status,
      }
    })
  }, [now])

  const openCount = useMemo(
    () => servicesWithStatus.filter((item) => item.status.statusType === "open" || item.status.statusType === "partial").length,
    [servicesWithStatus]
  )
  const closedCount = useMemo(
    () => servicesWithStatus.filter((item) => item.status.statusType === "closed").length,
    [servicesWithStatus]
  )

  const filteredServices = useMemo(() => {
    return servicesWithStatus.filter(({ service, status }) => {
      if (statusFilter === "open" && status.statusType === "closed") return false
      if (statusFilter === "closed" && status.statusType !== "closed") return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = service.name.toLowerCase().includes(q)
        const matchDesc = service.description.toLowerCase().includes(q)
        const matchBadge = status.badge.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchBadge) return false
      }
      return true
    })
  }, [servicesWithStatus, statusFilter, searchQuery])

  const handlePrimaryServiceAction = (service: ServiceItem) => {
    const meta = SERVICE_META[service.id]
    const status = meta ? computeServiceStatus(meta.schedule, now) : null
    const isClosed = status?.statusType === "closed"

    if (service.id === 1) {
      window.location.assign("/library")
      return
    }

    if (service.id === 2) {
      if (isClosed) {
        showToast("Pre-order token #CT-304 booked! Counter pickup opens at 08:30 AM.")
      } else {
        showToast("Meal token #CT-304 generated! Show token at Canteen Counter 2.")
      }
      setSelectedService(null)
      return
    }

    if (service.id === 3) {
      if (isClosed) {
        showToast("Morning transit routes start at 07:30 AM. Live GPS tracking will resume then.")
      } else {
        showToast("Bus Route 3 is 6 mins away from Main Campus Gate.")
      }
      setSelectedService(null)
      return
    }

    if (service.id === 4) {
      if (ticketQuery.trim()) {
        showToast(`IT Ticket submitted: "${ticketQuery.slice(0, 30)}..." Support will respond at 09:00 AM!`)
        setTicketQuery("")
      } else if (isClosed) {
        showToast("IT Ticket #IT-9102 queued for priority morning review at 09:00 AM.")
      } else {
        showToast("IT Ticket #IT-9102 logged for Wi-Fi & Portal credentials.")
      }
      setSelectedService(null)
      return
    }

    if (service.id === 5) {
      showToast("Medical emergency alert sent to Block A clinic desk (+91 79 108 0000).")
      setSelectedService(null)
      return
    }

    if (service.id === 6) {
      showToast("Lost & Found report logged at Security Gate 1 Desk.")
      setSelectedService(null)
      return
    }

    if (service.id === 7) {
      if (isClosed) {
        showToast("Bonafide request #BC-889 queued. Office processing begins at 10:00 AM.")
      } else {
        showToast("Bonafide certificate request #BC-889 received by Student Affairs.")
      }
      setSelectedService(null)
      return
    }

    if (service.id === 8) {
      showToast("Registration submitted for Tech Club! Coordinator will email you.")
      setSelectedService(null)
      return
    }
  }

  const selectedMeta = selectedService ? SERVICE_META[selectedService.id] : null
  const selectedStatus = selectedMeta ? computeServiceStatus(selectedMeta.schedule, now) : null

  const formattedCampusTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const formattedCampusDate = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-top-2 max-w-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Live Campus Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Services</h1>
          <p className="text-muted-foreground">Access essential campus facilities, support desks, and student services.</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-muted/40 border border-border/70 px-3.5 py-1.5 rounded-full text-xs shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-muted-foreground">Campus Time:</span>
          <span className="font-semibold text-foreground tracking-tight">
            {formattedCampusDate} · {formattedCampusTime}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 text-xs w-fit">
          <button
            onClick={() => setStatusFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all",
              statusFilter === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Services ({servicesMock.length})
          </button>
          <button
            onClick={() => setStatusFilter("open")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5",
              statusFilter === "open"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Open Now ({openCount})
          </button>
          <button
            onClick={() => setStatusFilter("closed")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5",
              statusFilter === "closed"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Closed ({closedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-background border border-input rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(({ service, meta, status }) => {
          const IconComponent = meta.icon

          return (
            <Card
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="cursor-pointer hover:border-primary/80 transition-all hover:shadow-md group border-border/60 flex flex-col justify-between"
            >
              <CardContent className="p-6 text-center space-y-4 flex flex-col flex-1 justify-between">
                <div className="space-y-3">
                  {/* Status Badge & Exact Timing Display */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-colors shrink-0",
                        status.statusType === "open" &&
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
                        status.statusType === "closed" &&
                          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
                        status.statusType === "partial" &&
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          status.statusType === "open" && "bg-emerald-500 animate-pulse",
                          status.statusType === "closed" && "bg-rose-500",
                          status.statusType === "partial" && "bg-amber-500"
                        )}
                      />
                      {status.badge}
                    </span>

                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium truncate text-right">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="truncate">{status.timingSummary}</span>
                    </span>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedService(service)
                    }}
                    className="w-full text-xs rounded-xl h-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors justify-between"
                  >
                    <span>View Service</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center space-y-3">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground">No services found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {statusFilter !== "all"
              ? `No services currently match the "${statusFilter}" filter.`
              : "Try adjusting your search keyword."}
          </p>
          <Button variant="outline" size="sm" onClick={() => { setStatusFilter("all"); setSearchQuery(""); }} className="rounded-xl text-xs">
            Reset Filters
          </Button>
        </div>
      )}

      {/* Service Action Modal */}
      {selectedService && selectedMeta && selectedStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedService(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl text-card-foreground space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {React.createElement(selectedMeta.icon || Laptop, { className: "h-5 w-5" })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight">{selectedService.name}</h2>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                        selectedStatus.statusType === "open" &&
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
                        selectedStatus.statusType === "closed" &&
                          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
                        selectedStatus.statusType === "partial" &&
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          selectedStatus.statusType === "open" && "bg-emerald-500 animate-pulse",
                          selectedStatus.statusType === "closed" && "bg-rose-500",
                          selectedStatus.statusType === "partial" && "bg-amber-500"
                        )}
                      />
                      {selectedStatus.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedService.description}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setSelectedService(null)}
                aria-label="Close service modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Live Status Banner */}
            <div
              className={cn(
                "rounded-xl border p-3 flex items-start gap-2.5 text-xs font-medium",
                selectedStatus.statusType === "open" &&
                  "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                selectedStatus.statusType === "closed" &&
                  "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
                selectedStatus.statusType === "partial" &&
                  "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
              )}
            >
              {selectedStatus.statusType === "open" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              ) : selectedStatus.statusType === "partial" ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-semibold">
                  {selectedStatus.statusType === "open"
                    ? "Currently Open"
                    : selectedStatus.statusType === "partial"
                    ? "Doctor Consultation Off-Duty (24/7 ER Active)"
                    : "Currently Closed"}
                </p>
                <p className="opacity-90 font-normal leading-relaxed">{selectedStatus.banner}</p>
              </div>
            </div>

            {/* Timings and Location */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Working Hours
                </div>
                <div className="font-semibold text-foreground">
                  {selectedMeta.timing}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {selectedMeta.schedule.daysDescription}
                </div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Desk Venue
                </div>
                <div className="font-semibold text-foreground">
                  {selectedMeta.location}
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Services Offered
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {selectedMeta.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extra input for IT Ticket */}
            {selectedService.id === 4 && (
              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-medium text-foreground">
                  Quick Ticket Description:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ticketQuery}
                    onChange={(e) => setTicketQuery(e.target.value)}
                    placeholder="e.g. Wi-Fi credentials not working on phone"
                    className="flex-1 bg-muted/30 border border-input rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Contact row */}
            <div className="rounded-xl border p-3 bg-muted/10 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Helpdesk Contact
              </span>
              <span className="font-medium text-foreground">
                {selectedMeta.contact}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedService(null)
                  window.location.assign("/copilot")
                }}
                className="rounded-xl text-xs gap-1.5"
              >
                Ask Copilot
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handlePrimaryServiceAction(selectedService)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  {selectedService.id === 1 ? (
                    <>
                      <span>{selectedMeta.actionLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <span>{selectedMeta.actionLabel}</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

