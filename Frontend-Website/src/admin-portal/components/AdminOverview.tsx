import { useEffect, useMemo, useRef, useState } from 'react'
import type { ElementType, FocusEvent, MouseEvent, ReactNode, Ref } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import type { Plugin } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Banknote, CalendarDays, Check, ChevronRight, FileText, ListFilter, Sailboat, UsersRound } from 'lucide-react'
import { useBoatListings } from '../../seller-portal/data/useBoatListings'
import { useSellers } from '../../seller-portal/data/useSellers'
import { directionalArrowVariants, inventoryMotion } from '../../seller-portal/lib/motion'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { useBlogPosts } from '../data/useBlogPosts'
import { useBuyers } from '../data/useBuyers'
import { useLeads } from '../data/useLeads'
import { useOverviewAvailability } from '../data/useOverviewAvailability'
import { useSales } from '../data/useSales'
import { leadStatuses, overviewBreakdowns, overviewSnapshot, saleStageLabel, toOverviewBoat, toOverviewBooking, toOverviewBuyer, toOverviewLead, toOverviewPost, toOverviewSale, toOverviewSlots } from '../lib/adminOverview'
import type { OverviewBooking, OverviewLead, OverviewSnapshot } from '../lib/adminOverview'
import { dateKey, monthDays, slotOccursOn, ukTime, ukToday } from '../lib/availability'
import { chartTooltipEvents, useOverviewChartTooltip } from '../lib/overviewChartTooltip'
import { AdminCollectionStats } from './AdminCollectionControls'
import { BoatPicture } from './BoatPicture'
import { OverviewChartTooltipProvider } from './OverviewChartTooltip'
import '../styles/admin-overview.css'

// Ported from boat-brokers/src/components/AdminOverview.jsx. Markup, classes and
// charts match the prototype; the records behind them come from the live admin
// API via the adapters in lib/adminOverview.ts. Paths are basename-relative.

ChartJS.register(ArcElement, Tooltip)

const MotionLink = motion.create(Link)
const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)
const shortDate = (value: string) => new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const viewingUrl = (item: OverviewBooking) => '/availability?date=' + item.date + '&viewing=' + encodeURIComponent(item.id)

function OverviewLink({ children, to, ...props }: { children?: ReactNode; to?: string; [prop: string]: unknown }) {
  const reduced = useReducedMotion()
  const Control = (to ? MotionLink : motion.button) as ElementType
  return <Control to={to} type={to ? undefined : 'button'} initial="rest" animate="rest" whileHover="hover" whileFocus="hover" variants={{ rest: { opacity: 1 }, hover: { opacity: .78 } }} whileTap={reduced ? undefined : { scale: .98 }} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }} {...props}>{children}</Control>
}
const MotionUpRight = motion.create(ArrowUpRight)
const MotionChevron = motion.create(ChevronRight)
function OverviewArrow({ right = false, size = 14 }: { right?: boolean; size?: number }) {
  const reduced = useReducedMotion()
  const Icon = right ? MotionChevron : MotionUpRight
  return <Icon size={size} aria-hidden="true" variants={directionalArrowVariants(reduced, right ? 'right' : 'up-right')} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }} />
}
function ChartReveal({ children, className, ref }: { children: ReactNode; className?: string; ref?: Ref<HTMLDivElement> }) {
  const reduced = useReducedMotion()
  return <motion.div ref={ref} className={className} initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }}>{children}</motion.div>
}
function OverviewPanel({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.section className={className} initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }}>{children}</motion.section>
}
function PanelHeading({ title, to, action = 'View all' }: { title: ReactNode; to: string; action?: string }) {
  return <div className="admin-panel-heading"><h2>{title}</h2><OverviewLink to={to}>{action}<OverviewArrow /></OverviewLink></div>
}
function MiniCalendar({ snapshot, today }: { snapshot: OverviewSnapshot; today: string }) {
  const tooltip = useOverviewChartTooltip()
  const month = new Date(today + 'T12:00:00')
  const days = monthDays(month.getFullYear(), month.getMonth())
  const active = snapshot.bookings.filter(item => item.status !== 'Rejected')
  return <OverviewPanel className="admin-panel v2-glass-surface overview-calendar">
    <PanelHeading title={<>Availability<span className="overview-calendar-month">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span></>} action="Open calendar" to={'/availability?date=' + today} />
    <table className="overview-mini-calendar" aria-label="Availability month preview"><thead><tr>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <th key={day} scope="col">{day}</th>)}</tr></thead><tbody>{Array.from({ length: days.length / 7 }, (_, index) => <tr key={index}>{days.slice(index * 7, index * 7 + 7).map(day => {
      const key = dateKey(day), requests = active.filter(item => item.date === key), open = snapshot.availabilitySlots.some(item => slotOccursOn(item, key))
      const label = day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + requests.filter(item => item.status === 'Approved').length + ' booked, ' + requests.filter(item => item.status === 'Pending').length + ' pending' + (open ? ', availability open' : '')
      const content = <><span>{day.getDate()}</span><span className="overview-date-dots" aria-hidden="true">{open && <i className="is-open" />}{requests.some(item => item.status === 'Approved') && <i className="is-booked" />}{requests.some(item => item.status === 'Pending') && <i className="is-pending" />}</span></>
      const className = 'overview-mini-day ' + (day.getMonth() !== month.getMonth() ? 'is-outside ' : '') + (key === today ? 'is-selected' : '')
      return <td key={key}>{key < today ? <span className={className} aria-label={label} {...chartTooltipEvents(tooltip, shortDate(key), label.split(', ').slice(2).join(', '))}>{content}</span> : <OverviewLink className={className} {...chartTooltipEvents(tooltip, shortDate(key), label.split(', ').slice(2).join(', '))} aria-label={label} aria-current={key === today ? 'date' : undefined} to={'/availability?date=' + key}>{content}</OverviewLink>}</td>
    })}</tr>)}</tbody></table>
    <div className="overview-calendar-legend"><span><i className="is-open" />Available</span><span><i className="is-booked" />Booked</span><span><i className="is-pending" />Pending</span></div>
  </OverviewPanel>
}

const chartColors = ['#1ba6d4', '#a8c7d4', '#0d5673', '#789caf']
type DonutItem = { label: string; count: number; to: string }
function OverviewDonut({ items, noun }: { items: DonutItem[]; noun: string }) {
  const total = items.reduce((sum, item) => sum + item.count, 0)
  const reduced = useReducedMotion()
  const tooltip = useOverviewChartTooltip()
  const chart = useRef<ChartJS<'doughnut'>>(null)
  const chartRegion = useRef<HTMLDivElement>(null)
  const entered = useInView(chartRegion, { once: true, amount: .35 })
  const progressed = useRef(false)
  const progress = useRef(reduced ? 1 : 0)
  const geometry = useRef<{ arc: ArcElement; end: number; circumference: number }[]>([])
  const segmentGrowth = useMemo<Plugin<'doughnut'>>(() => {
    return {
      id: 'overviewSegmentGrowth',
      beforeDatasetDraw(_instance, { meta }) {
        if (progress.current >= 1) return
        if (progress.current <= 0) return false
        geometry.current = (meta.data as ArcElement[]).map(arc => ({ arc, end: arc.endAngle, circumference: arc.circumference }))
        geometry.current.forEach(({ arc, end }) => {
          arc.endAngle = arc.startAngle + (end - arc.startAngle) * progress.current
          arc.circumference *= progress.current
        })
      },
      afterDatasetDraw() {
        geometry.current.forEach(({ arc, end, circumference }) => {
          arc.endAngle = end
          arc.circumference = circumference
        })
        geometry.current = []
      },
    }
  }, [])
  const hasData = total > 0
  useEffect(() => {
    if (!chart.current || !hasData || !entered && !reduced) return
    const instance = chart.current
    const draw = (value: number) => {
      progress.current = value
      instance.draw()
    }
    if (reduced || progressed.current) { draw(1); return }
    // Grow each arc from its own fixed start, without rotating or redistributing categories.
    const controls = animate(0, 1, { ...inventoryMotion.media, onUpdate: draw, onComplete: () => { progressed.current = true } })
    return () => controls.stop()
  }, [entered, reduced, hasData])
  const chartData = useMemo(() => ({ labels: items.map(item => item.label), datasets: [{ data: items.map(item => item.count), backgroundColor: chartColors, borderWidth: 0, borderRadius: 6, spacing: 3, hoverOffset: reduced ? 0 : 4 }] }), [items, reduced])
  const options = useMemo(() => ({ responsive: true, maintainAspectRatio: false, cutout: '73%', animation: false as const, plugins: { legend: { display: false }, tooltip: { enabled: false, external: ({ chart: canvasChart, tooltip: model }: { chart: ChartJS; tooltip: { opacity: number; caretX: number; caretY: number; dataPoints?: { label: string; formattedValue: string }[] } }) => {
    if (!model.opacity) { tooltip.hide(); return }
    const point = model.dataPoints?.[0]
    if (!point) return
    const rect = canvasChart.canvas.getBoundingClientRect()
    const left = rect.left + model.caretX, top = rect.top + model.caretY
    tooltip.show(point.label, point.formattedValue + ' ' + noun, { left, top, bottom: top })
  } } } }), [tooltip, noun])
  const highlight = (index: number | null) => {
    chart.current?.setActiveElements(index === null || !total ? [] : [{ datasetIndex: 0, index }])
    chart.current?.update('none')
  }
  return <ChartReveal className="overview-donut-layout"><div ref={chartRegion} className="overview-donut" onMouseLeave={tooltip.hide}>{total ? <Doughnut ref={chart} plugins={[segmentGrowth]} data={chartData} options={options} role="img" aria-label={total + ' ' + noun + ': ' + items.map(item => item.label + ' ' + item.count).join(', ')} /> : <div className="overview-donut-empty" role="img" tabIndex={0} aria-label={'No ' + noun + ' recorded'} {...chartTooltipEvents(tooltip, 'No ' + noun + ' recorded', '0 total')} />}<div className="overview-donut-center" aria-hidden="true"><strong>{total}</strong><span>{noun}</span></div></div><div className="overview-chart-legend">{items.map((item, index) => {
    const events = chartTooltipEvents(tooltip, item.label, item.count + ' ' + noun)
    return <OverviewLink key={item.label} to={item.to} {...events} onMouseEnter={(event: MouseEvent<HTMLElement>) => { highlight(index); events.onMouseEnter(event) }} onMouseLeave={() => { highlight(null); tooltip.hide() }} onFocus={(event: FocusEvent<HTMLElement>) => { highlight(index); events.onFocus(event) }} onBlur={() => { highlight(null); tooltip.hide() }}><i style={{ backgroundColor: chartColors[index] }} /><span>{item.label}</span><strong>{item.count}</strong></OverviewLink>
  })}</div></ChartReveal>
}
function CountBars({ items }: { items: DonutItem[] }) {
  const region = useRef<HTMLDivElement>(null)
  const entered = useInView(region, { once: true, amount: .12 })
  const reduced = useReducedMotion()
  const tooltip = useOverviewChartTooltip()
  const maximum = Math.max(1, ...items.map(item => item.count))
  return <div ref={region} className="overview-count-bars">{items.map((item, index) => <OverviewLink to={item.to} key={item.label} {...chartTooltipEvents(tooltip, item.label, String(item.count))}><span>{item.label}<strong>{item.count}</strong></span><span className="overview-count-track" aria-hidden="true"><motion.i style={{ width: item.count / maximum * 100 + '%', transformOrigin: 'left' }} initial={false} animate={{ scaleX: reduced || entered ? 1 : 0 }} transition={{ ...inventoryMotion.media, duration: reduced ? 0 : inventoryMotion.media.duration, delay: reduced ? 0 : index * .04 }} /></span></OverviewLink>)}</div>
}

function OverviewCharts({ snapshot, leads }: { snapshot: OverviewSnapshot; leads: OverviewLead[] }) {
  const sourceRegion = useRef<HTMLElement>(null)
  const sourceEntered = useInView(sourceRegion, { once: true, amount: .12 })
  const tooltip = useOverviewChartTooltip()
  const { approvals, sources } = overviewBreakdowns(snapshot.boats, leads)
  const reduced = useReducedMotion()
  const maximum = Math.max(2, Math.ceil(Math.max(0, ...sources.map(item => item.count)) / 2) * 2)
  return <>
    <OverviewPanel className="admin-panel v2-glass-surface"><PanelHeading title="Boat approvals" to="/boats" action="View boats" /><OverviewDonut noun="boats" items={approvals.map(item => ({ ...item, to: '/boats?status=' + encodeURIComponent(item.label) }))} />{!snapshot.boats.length && <p className="overview-muted">No submitted boats yet.</p>}</OverviewPanel>
    <OverviewPanel className="admin-pipeline overview-source-panel"><PanelHeading title="Where leads come from" to="/leads?status=All" action="View leads" /><figure ref={sourceRegion} className="overview-bar-chart" aria-label="Lead counts by source"><figcaption className="sr-only">{sources.map(item => item.label + ': ' + item.count).join(', ') || 'No leads yet.'}</figcaption><div className="overview-bar-area"><div className="overview-bar-axis" aria-hidden="true"><span>{maximum}</span><span>{maximum / 2}</span><span>0</span></div><div className="overview-bar-plot" style={{ gridTemplateColumns: 'repeat(' + Math.max(1, sources.length) + ', minmax(0, 1fr))' }}>{sources.map((item, index) => <OverviewLink key={item.label} className="overview-bar-column" to={'/leads?status=All&source=' + encodeURIComponent(item.label)} aria-label={item.label + ': ' + item.count + ' leads'} {...chartTooltipEvents(tooltip, item.label, item.count + ' leads')}><motion.span className="overview-bar-fill" style={{ height: item.count / maximum * 100 + '%' }} initial={false} animate={{ scaleY: reduced || sourceEntered ? 1 : 0 }} transition={{ ...inventoryMotion.media, duration: reduced ? 0 : inventoryMotion.media.duration, delay: reduced ? 0 : index * .06 }}><strong>{item.count}</strong></motion.span></OverviewLink>)}</div></div><div className="overview-bar-labels" style={{ gridTemplateColumns: 'repeat(' + Math.max(1, sources.length) + ', minmax(0, 1fr))' }}>{sources.map(item => <span key={item.label}>{item.label}</span>)}</div></figure>{!leads.length && <p className="overview-muted">No leads recorded yet.</p>}</OverviewPanel>
  </>
}

function OverviewContent({ onNotice }: { onNotice?: (notice: Notice) => void }) {
  const pipelineRegion = useRef<HTMLDivElement>(null)
  const pipelineEntered = useInView(pipelineRegion, { once: true, amount: .12 })
  const reduced = useReducedMotion()
  const tooltip = useOverviewChartTooltip()
  const listings = useBoatListings(), sellerRecords = useSellers(), buyerRecords = useBuyers(), leadRecords = useLeads(), saleRecords = useSales(), blogRecords = useBlogPosts(), availability = useOverviewAvailability()
  const [today] = useState(ukToday)
  const [time] = useState(ukTime)
  const loading = [listings, sellerRecords, buyerRecords, leadRecords, saleRecords, blogRecords, availability].some(source => source.loading)
  const errors = [listings, sellerRecords, buyerRecords, leadRecords, saleRecords, blogRecords, availability].map(source => source.error).filter(Boolean)
  const firstError = errors[0] ?? null
  useEffect(() => {
    if (firstError) onNotice?.({ type: 'error', title: 'Some overview figures could not be loaded', description: firstError })
  }, [firstError, onNotice])
  const leads = useMemo(() => leadRecords.leads.map(toOverviewLead), [leadRecords.leads])
  const data = useMemo(() => overviewSnapshot({
    boats: listings.listings.map(toOverviewBoat), leads, buyers: buyerRecords.buyers.map(toOverviewBuyer), sellers: sellerRecords.sellers,
    sales: saleRecords.sales.map(toOverviewSale), blogPosts: blogRecords.posts.map(toOverviewPost),
    bookings: availability.bookings.map(toOverviewBooking), availabilitySlots: toOverviewSlots(availability.slots),
  }, today, time), [listings.listings, leads, buyerRecords.buyers, sellerRecords.sellers, saleRecords.sales, blogRecords.posts, availability.bookings, availability.slots, today, time])
  const count = (value: number) => loading ? '–' : value
  const metrics = [
    { value: 'leads', label: 'Leads', count: count(leads.length), icon: ListFilter, to: '/leads?status=All' },
    { value: 'buyers', label: 'Boat buyers', count: count(data.buyers.length), icon: UsersRound, to: '/boat-buyers' },
    { value: 'boats', label: 'Boats', count: count(data.boats.length), icon: Sailboat, to: '/boats' },
    { value: 'sales', label: 'Sales', count: count(data.sales.length), icon: Banknote, to: '/sales' },
    { value: 'blogs', label: 'Blog posts', count: count(data.blogPosts.length), icon: FileText, to: '/blogs' },
    { value: 'viewings', label: 'Upcoming viewings', count: count(data.upcoming.length), icon: CalendarDays, to: '/availability' },
  ]
  return <div className="admin-overview" aria-busy={loading}>
    <AdminCollectionStats label="Overview statistics" items={metrics} value="" />
    <div className="overview-grid">
      <OverviewCharts snapshot={data} leads={leads} />
      <OverviewPanel className="admin-panel v2-glass-surface"><PanelHeading title="Ready for your review" to="/boats?status=Awaiting+review" action="Review boats" /><div className="overview-review-list">{data.review.length ? data.review.slice(0, 3).map(boat => <OverviewLink className="overview-review-row" to={'/boats?boat=' + encodeURIComponent(boat.id)} key={boat.id}><BoatPicture image={boat.image} /><span><strong>{boat.name}</strong><span>{boat.type} · {boat.price == null ? 'Price on request' : money(boat.price)}</span></span><OverviewArrow right size={16} /></OverviewLink>) : <div className="overview-empty"><Check size={24} /><h3>All caught up</h3><p>No boats are awaiting review.</p></div>}</div><div className="overview-attention-chart"><CountBars items={[{ label: 'Changes requested', count: data.changes.length, to: '/boats?status=Changes+required' }, { label: 'Pending viewing requests', count: data.pending.length, to: data.pending.length ? viewingUrl(data.pending[0]) : '/availability' }]} /></div></OverviewPanel>
      <MiniCalendar snapshot={data} today={today} />

        <OverviewPanel className="admin-panel v2-glass-surface"><PanelHeading title="Sales at a glance" to="/sales" /><OverviewDonut noun="sales" items={([['Current', data.currentSales.length], ['Completed', data.completedSales.length], ['Cancelled', data.cancelledSales.length]] as const).map(([status, count]) => ({ label: saleStageLabel(status), count, to: '/sales?status=' + status }))} />{data.sales.length ? <div className="overview-sales-value"><span>Completed sale value</span><strong>{money(data.completedSales.reduce((sum, sale) => sum + sale.price, 0))}</strong></div> : <p className="overview-muted">No sales recorded yet. Record a sale from an approved boat to see it here.</p>}</OverviewPanel>
        <OverviewPanel className="admin-panel v2-glass-surface"><PanelHeading title="People & listings" to="/boats?view=sellers" action="View sellers" /><CountBars items={([
          ['New buyers', data.newBuyers.length, '/boat-buyers?status=New'],
          ['Viewing-stage buyers', data.buyers.filter(buyer => buyer.status === 'Viewing Booked').length, '/boat-buyers?status=Viewing+Booked'],
          ['Sellers', data.sellers.length, '/boats?view=sellers'],
          ['Published boats', data.published.length, '/boats?publication=Published'],
        ] as const).map(([label, count, to]) => ({ label, count, to }))} /><p className="overview-muted">Current counts across contacts and published inventory. Buyer stages are independent of viewing requests.</p></OverviewPanel>
      <OverviewPanel className="admin-pipeline overview-pipeline overview-lead-stages"><PanelHeading title="Lead pipeline" to="/leads?status=All" action="View leads" /><p className="admin-pipeline-total"><strong>{leads.length}</strong>total enquiries</p><ChartReveal ref={pipelineRegion}><motion.div className="overview-stage-strip" initial={false} animate={{ scaleX: reduced || pipelineEntered ? 1 : 0 }} style={{ transformOrigin: 'left' }} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }}>{leadStatuses.map((stage, index) => leads.some(lead => lead.status === stage) && <OverviewLink key={stage} aria-label={stage + ': ' + leads.filter(lead => lead.status === stage).length + ' leads'} to={'/leads?status=' + stage} style={{ flex: leads.filter(lead => lead.status === stage).length, backgroundColor: chartColors[index] }} {...chartTooltipEvents(tooltip, stage, leads.filter(lead => lead.status === stage).length + ' leads')} />)}</motion.div></ChartReveal><div className="overview-stage-key">{leadStatuses.map((stage, index) => <OverviewLink key={stage} to={'/leads?status=' + stage} {...chartTooltipEvents(tooltip, stage, leads.filter(lead => lead.status === stage).length + ' leads')}><i style={{ backgroundColor: chartColors[index] }} /><span>{stage}</span><strong>{leads.filter(lead => lead.status === stage).length}</strong></OverviewLink>)}</div></OverviewPanel>
      <OverviewPanel className="admin-panel v2-glass-surface overview-posts"><PanelHeading title="Latest blog posts" to="/blogs" action="Manage posts" /><div className="overview-post-grid">{data.latestPosts.length ? data.latestPosts.map(post => <OverviewLink to={'/blogs/' + post.id + '/edit'} className="overview-post-row" key={post.id}><BoatPicture fallback={FileText} image={post.image} /><div><strong>{post.title}</strong><span>{post.author}</span><span>{shortDate(post.date)} · {post.readTime}</span></div><OverviewArrow size={15} /></OverviewLink>) : <p className="overview-muted">No blog posts yet.</p>}</div></OverviewPanel>
    </div>
  </div>
}

export default function AdminOverview(props: { onNotice?: (notice: Notice) => void }) {
  return <OverviewChartTooltipProvider><OverviewContent {...props} /></OverviewChartTooltipProvider>
}
