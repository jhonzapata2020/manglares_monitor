"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Cloud,
  Command,
  Download,
  FileBarChart,
  Globe,
  Layers,
  LineChart,
  Leaf,
  MapPin,
  MessageSquare,
  Radar,
  RefreshCw,
  Search,
  Settings,
  Trees,
  Waves,
  type LucideIcon,
  Calendar,
  Filter,
  Info,
  Eye,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

// Importación dinámica del componente de mapa
import dynamic from "next/dynamic"

// Definir el tipo para las alertas de deforestación
type DeforestationAlert = {
  id: string
  location: string
  coordinates: [number, number]
  severity: "high" | "medium" | "low"
  date: string
  area: number
  description: string
}

// Definir el tipo para los datos de biodiversidad
type BiodiversityData = {
  species: string
  count: number
  trend: "increasing" | "stable" | "decreasing"
  status: "endangered" | "vulnerable" | "stable"
  icon: string
}

// Definir el tipo para los datos de erosión costera
type CoastalErosionData = {
  location: string
  rate: number // tasa de erosión en metros por año
  risk: "high" | "medium" | "low"
  affectedArea: number // área afectada en hectáreas
}

// Definir el tipo para los datos de captura de CO2
type CO2CaptureData = {
  month: string
  value: number // toneladas de CO2
}

export default function DashboardManglares() {
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Estado para la capa del mapa seleccionada
  const [selectedLayer, setSelectedLayer] = useState<string>("satellite")

  // Estado para los datos de deforestación
  const [deforestationData, setDeforestationData] = useState<{
    total: number
    monthly: number
    alerts: DeforestationAlert[]
  }>({
    total: 0,
    monthly: 0,
    alerts: [],
  })

  // Estado para los datos de biodiversidad
  const [biodiversityData, setBiodiversityData] = useState<{
    speciesCount: number
    endangeredCount: number
    species: BiodiversityData[]
  }>({
    speciesCount: 0,
    endangeredCount: 0,
    species: [],
  })

  // Estado para los datos de erosión costera
  const [coastalErosionData, setCoastalErosionData] = useState<{
    averageRate: number
    highRiskAreas: number
    data: CoastalErosionData[]
  }>({
    averageRate: 0,
    highRiskAreas: 0,
    data: [],
  })

  // Estado para los datos de captura de CO2
  const [co2CaptureData, setCo2CaptureData] = useState<{
    total: number
    monthly: number
    data: CO2CaptureData[]
  }>({
    total: 0,
    monthly: 0,
    data: [],
  })

  // Estado para el estado del sistema
  const [systemStatus, setSystemStatus] = useState({
    satellite: 95,
    dataProcessing: 88,
    alerts: 92,
  })

  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cargar el componente de mapa de forma dinámica para evitar problemas de SSR
  const MapComponent = dynamic(() => import("@/components/dashboard/map-component"), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-cyan-500 font-mono text-sm">CARGANDO MAPA</div>
        </div>
      </div>
    ),
  })

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simular datos de deforestación
      setDeforestationData({
        total: 245.8, // hectáreas
        monthly: 12.3, // hectáreas en el último mes
        alerts: [
          {
            id: "DEF-001",
            location: "Norte del Golfo de Urabá",
            coordinates: [8.1, -76.7],
            severity: "high",
            date: "2025-03-12",
            area: 5.2,
            description: "Tala ilegal detectada por cambios en la firma espectral",
          },
          {
            id: "DEF-002",
            location: "Bahía Colombia",
            coordinates: [8.0, -76.8],
            severity: "medium",
            date: "2025-03-10",
            area: 3.1,
            description: "Reducción de cobertura vegetal detectada",
          },
          {
            id: "DEF-003",
            location: "Desembocadura del Río Atrato",
            coordinates: [8.2, -76.9],
            severity: "high",
            date: "2025-03-08",
            area: 7.5,
            description: "Conversión de manglar a zona agrícola",
          },
          {
            id: "DEF-004",
            location: "Punta Caimán",
            coordinates: [8.3, -76.7],
            severity: "low",
            date: "2025-03-05",
            area: 1.8,
            description: "Posible degradación natural",
          },
        ],
      })

      // Simular datos de biodiversidad
      setBiodiversityData({
        speciesCount: 187,
        endangeredCount: 42,
        species: [
          {
            species: "Mangle rojo (Rhizophora mangle)",
            count: 12500,
            trend: "stable",
            status: "stable",
            icon: "🌳",
          },
          {
            species: "Cangrejo azul (Cardisoma guanhumi)",
            count: 8700,
            trend: "decreasing",
            status: "vulnerable",
            icon: "🦀",
          },
          {
            species: "Garza tigre (Tigrisoma fasciatum)",
            count: 350,
            trend: "decreasing",
            status: "endangered",
            icon: "🐦",
          },
          {
            species: "Pez sábalo (Megalops atlanticus)",
            count: 1200,
            trend: "increasing",
            status: "vulnerable",
            icon: "🐟",
          },
          {
            species: "Manatí (Trichechus manatus)",
            count: 78,
            trend: "stable",
            status: "endangered",
            icon: "🐋",
          },
        ],
      })

      // Simular datos de erosión costera
      setCoastalErosionData({
        averageRate: 2.3, // metros por año
        highRiskAreas: 5,
        data: [
          {
            location: "Playa Turbo",
            rate: 3.2,
            risk: "high",
            affectedArea: 12.5,
          },
          {
            location: "Punta Arenas",
            rate: 2.8,
            risk: "high",
            affectedArea: 8.7,
          },
          {
            location: "Bahía Colombia",
            rate: 1.5,
            risk: "medium",
            affectedArea: 5.3,
          },
          {
            location: "Boca Tarena",
            rate: 2.1,
            risk: "medium",
            affectedArea: 6.8,
          },
          {
            location: "Necoclí",
            rate: 3.5,
            risk: "high",
            affectedArea: 14.2,
          },
        ],
      })

      // Simular datos de captura de CO2
      setCo2CaptureData({
        total: 45280, // toneladas
        monthly: 3750, // toneladas en el último mes
        data: [
          { month: "Ene", value: 3650 },
          { month: "Feb", value: 3720 },
          { month: "Mar", value: 3750 },
          { month: "Abr", value: 3800 },
          { month: "May", value: 3850 },
          { month: "Jun", value: 3900 },
          { month: "Jul", value: 3820 },
          { month: "Ago", value: 3780 },
          { month: "Sep", value: 3750 },
          { month: "Oct", value: 3720 },
          { month: "Nov", value: 3680 },
          { month: "Dic", value: 3650 },
        ],
      })

      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Efecto para el fondo de partículas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color = `rgba(${Math.floor(Math.random() * 50) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.4 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Función para manejar el cambio de capa del mapa
  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer)
  }

  // Función para manejar el cambio de fecha
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 relative overflow-hidden">
      {/* Fondo de partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-green-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-cyan-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-teal-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-green-500 font-mono text-sm tracking-wider">INICIALIZANDO SISTEMA</div>
            <div className="mt-2 text-slate-400 text-xs">Cargando datos de monitoreo de manglares</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Encabezado */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Trees className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              MANGLAR MONITOR
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ubicación..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alertas de deforestación</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DatePicker
                date={selectedDate}
                onSelect={handleDateChange}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100"
              />

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                <AvatarFallback className="bg-slate-700 text-green-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="grid grid-cols-12 gap-6">
          {/* Barra lateral */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Dashboard" active />
                  <NavItem icon={Globe} label="Mapa de Manglares" />
                  <NavItem icon={Trees} label="Deforestación" />
                  <NavItem icon={Leaf} label="Biodiversidad" />
                  <NavItem icon={Waves} label="Erosión Costera" />
                  <NavItem icon={Cloud} label="Captura de CO2" />
                  <NavItem icon={Activity} label="Monitoreo en Tiempo Real" />
                  <NavItem icon={MessageSquare} label="Reportes" />
                  <NavItem icon={Settings} label="Configuración" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">ESTADO DEL SISTEMA</div>
                  <div className="space-y-3">
                    <StatusItem label="Conexión Satelital" value={systemStatus.satellite} color="green" />
                    <StatusItem label="Procesamiento de Datos" value={systemStatus.dataProcessing} color="cyan" />
                    <StatusItem label="Sistema de Alertas" value={systemStatus.alerts} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard principal */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* Mapa de visualización */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-green-500" />
                      Monitoreo de Manglares - Golfo de Urabá
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-green-400 border-green-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                        SATELITAL
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Controles del mapa */}
                    <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-md p-2 border border-slate-700/50">
                      <div className="flex flex-col space-y-2">
                        <div className="text-xs text-slate-400 mb-1">Capas del Mapa</div>
                        <div className="space-y-1">
                          <LayerButton
                            label="Satelital"
                            active={selectedLayer === "satellite"}
                            onClick={() => handleLayerChange("satellite")}
                          />
                          <LayerButton
                            label="Deforestación"
                            active={selectedLayer === "deforestation"}
                            onClick={() => handleLayerChange("deforestation")}
                          />
                          <LayerButton
                            label="Biodiversidad"
                            active={selectedLayer === "biodiversity"}
                            onClick={() => handleLayerChange("biodiversity")}
                          />
                          <LayerButton
                            label="Erosión"
                            active={selectedLayer === "erosion"}
                            onClick={() => handleLayerChange("erosion")}
                          />
                          <LayerButton
                            label="Captura CO2"
                            active={selectedLayer === "co2"}
                            onClick={() => handleLayerChange("co2")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Componente del mapa */}
                    <div className="h-[500px] w-full">
                      <MapComponent
                        selectedDate={selectedDate.toISOString().split("T")[0]}
                        mapLayer={selectedLayer}
                        onLayerChange={handleLayerChange}
                        alerts={deforestationData.alerts}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Área de Manglares"
                  value="12,450"
                  unit="hectáreas"
                  icon={Trees}
                  trend="stable"
                  color="green"
                  detail="Última actualización: 15/03/2025"
                />
                <MetricCard
                  title="Deforestación"
                  value={formatNumber(deforestationData.total)}
                  unit="hectáreas"
                  icon={FileBarChart}
                  trend="up"
                  color="red"
                  detail={`${deforestationData.monthly} ha en el último mes`}
                />
                <MetricCard
                  title="Especies Monitoreadas"
                  value={formatNumber(biodiversityData.speciesCount)}
                  unit="especies"
                  icon={Leaf}
                  trend="stable"
                  color="cyan"
                  detail={`${biodiversityData.endangeredCount} en peligro`}
                />
                <MetricCard
                  title="Captura de CO2"
                  value={formatNumber(co2CaptureData.total)}
                  unit="ton"
                  icon={Cloud}
                  trend="up"
                  color="blue"
                  detail={`${formatNumber(co2CaptureData.monthly)} ton/mes`}
                />
              </div>

              {/* Pestañas de datos */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Tabs defaultValue="deforestation" className="w-full">
                    <TabsList className="bg-slate-800/50 p-1 mb-6">
                      <TabsTrigger
                        value="deforestation"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                      >
                        Deforestación
                      </TabsTrigger>
                      <TabsTrigger
                        value="biodiversity"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                      >
                        Biodiversidad
                      </TabsTrigger>
                      <TabsTrigger
                        value="erosion"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                      >
                        Erosión Costera
                      </TabsTrigger>
                      <TabsTrigger
                        value="co2"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                      >
                        Captura de CO2
                      </TabsTrigger>
                    </TabsList>

                    {/* Contenido de Deforestación */}
                    <TabsContent value="deforestation" className="mt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Alertas de Deforestación</h3>
                            <div className="space-y-3">
                              {deforestationData.alerts.map((alert) => (
                                <AlertItem
                                  key={alert.id}
                                  title={alert.location}
                                  time={alert.date}
                                  description={`${alert.area} ha - ${alert.description}`}
                                  type={
                                    alert.severity === "high"
                                      ? "error"
                                      : alert.severity === "medium"
                                        ? "warning"
                                        : "info"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Tendencia de Deforestación</h3>
                            <div className="h-64 w-full relative">
                              <DeforestationChart />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <h3 className="text-sm font-medium text-slate-300 mb-3">Acciones de Mitigación</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ActionCard
                              title="Patrullaje"
                              description="Incrementar patrullajes en áreas de alto riesgo"
                              status="En progreso"
                              progress={65}
                            />
                            <ActionCard
                              title="Reforestación"
                              description="Programa de reforestación en áreas degradadas"
                              status="Planificado"
                              progress={30}
                            />
                            <ActionCard
                              title="Educación"
                              description="Talleres comunitarios sobre conservación"
                              status="Completado"
                              progress={100}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Contenido de Biodiversidad */}
                    <TabsContent value="biodiversity" className="mt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Especies Monitoreadas</h3>
                            <div className="space-y-3">
                              {biodiversityData.species.map((species) => (
                                <div
                                  key={species.species}
                                  className="flex items-center justify-between p-2 rounded-md bg-slate-800/50 border border-slate-700/50"
                                >
                                  <div className="flex items-center">
                                    <div className="text-xl mr-2">{species.icon}</div>
                                    <div>
                                      <div className="text-sm text-slate-200">{species.species}</div>
                                      <div className="text-xs text-slate-400">
                                        Población: {formatNumber(species.count)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <Badge
                                      className={`
                                      ${
                                        species.status === "endangered"
                                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                                          : species.status === "vulnerable"
                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                            : "bg-green-500/20 text-green-400 border-green-500/30"
                                      }
                                    `}
                                    >
                                      {species.status === "endangered"
                                        ? "En peligro"
                                        : species.status === "vulnerable"
                                          ? "Vulnerable"
                                          : "Estable"}
                                    </Badge>
                                    <div className="text-xs mt-1 flex items-center">
                                      {species.trend === "increasing" ? (
                                        <>
                                          <LineChart className="h-3 w-3 text-green-500 mr-1" />{" "}
                                          <span className="text-green-400">Aumentando</span>
                                        </>
                                      ) : species.trend === "decreasing" ? (
                                        <>
                                          <LineChart className="h-3 w-3 text-red-500 mr-1 rotate-180" />{" "}
                                          <span className="text-red-400">Disminuyendo</span>
                                        </>
                                      ) : (
                                        <>
                                          <LineChart className="h-3 w-3 text-blue-500 mr-1" />{" "}
                                          <span className="text-blue-400">Estable</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Distribución de Especies</h3>
                            <div className="h-64 w-full relative">
                              <BiodiversityChart />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <h3 className="text-sm font-medium text-slate-300 mb-3">Programas de Conservación</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ActionCard
                              title="Monitoreo de Nidos"
                              description="Seguimiento de nidos de aves en manglares"
                              status="Activo"
                              progress={85}
                            />
                            <ActionCard
                              title="Corredores Biológicos"
                              description="Establecimiento de corredores entre fragmentos"
                              status="En progreso"
                              progress={45}
                            />
                            <ActionCard
                              title="Censo de Manatíes"
                              description="Monitoreo de población de manatíes"
                              status="Planificado"
                              progress={20}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Contenido de Erosión Costera */}
                    <TabsContent value="erosion" className="mt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Áreas de Riesgo</h3>
                            <div className="space-y-3">
                              {coastalErosionData.data.map((area) => (
                                <div
                                  key={area.location}
                                  className="p-3 rounded-md bg-slate-800/50 border border-slate-700/50"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-slate-200">{area.location}</div>
                                    <Badge
                                      className={`
                                      ${
                                        area.risk === "high"
                                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                                          : area.risk === "medium"
                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                            : "bg-green-500/20 text-green-400 border-green-500/30"
                                      }
                                    `}
                                    >
                                      {area.risk === "high"
                                        ? "Alto riesgo"
                                        : area.risk === "medium"
                                          ? "Riesgo medio"
                                          : "Bajo riesgo"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-slate-400">
                                    <div>Tasa de erosión: {area.rate} m/año</div>
                                    <div>Área afectada: {area.affectedArea} ha</div>
                                  </div>
                                  <div className="mt-2">
                                    <Progress
                                      value={area.risk === "high" ? 90 : area.risk === "medium" ? 60 : 30}
                                      className="h-1.5 bg-slate-700"
                                    >
                                      <div
                                        className={`h-full rounded-full ${
                                          area.risk === "high"
                                            ? "bg-red-500"
                                            : area.risk === "medium"
                                              ? "bg-amber-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{
                                          width: `${area.risk === "high" ? 90 : area.risk === "medium" ? 60 : 30}%`,
                                        }}
                                      />
                                    </Progress>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Tendencia de Erosión</h3>
                            <div className="h-64 w-full relative">
                              <ErosionChart />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <h3 className="text-sm font-medium text-slate-300 mb-3">Medidas de Protección</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ActionCard
                              title="Restauración de Manglares"
                              description="Plantación de manglares en zonas críticas"
                              status="Activo"
                              progress={75}
                            />
                            <ActionCard
                              title="Barreras Naturales"
                              description="Instalación de barreras de protección"
                              status="En progreso"
                              progress={50}
                            />
                            <ActionCard
                              title="Monitoreo Costero"
                              description="Sistema de alerta temprana de erosión"
                              status="Activo"
                              progress={90}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Contenido de Captura de CO2 */}
                    <TabsContent value="co2" className="mt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Captura de CO2 por Mes</h3>
                            <div className="h-64 w-full relative">
                              <CO2Chart data={co2CaptureData.data} />
                            </div>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">Estadísticas de Captura</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-sm text-slate-400">Captura Total Anual</div>
                                  <div className="text-sm text-green-400">
                                    {formatNumber(co2CaptureData.total)} toneladas
                                  </div>
                                </div>
                                <Progress value={85} className="h-2 bg-slate-700">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                                    style={{ width: "85%" }}
                                  />
                                </Progress>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-sm text-slate-400">Promedio Mensual</div>
                                  <div className="text-sm text-green-400">
                                    {formatNumber(co2CaptureData.monthly)} toneladas
                                  </div>
                                </div>
                                <Progress value={75} className="h-2 bg-slate-700">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                                    style={{ width: "75%" }}
                                  />
                                </Progress>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-sm text-slate-400">Eficiencia de Captura</div>
                                  <div className="text-sm text-green-400">3.8 ton/ha</div>
                                </div>
                                <Progress value={92} className="h-2 bg-slate-700">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                                    style={{ width: "92%" }}
                                  />
                                </Progress>
                              </div>

                              <div className="p-3 rounded-md bg-slate-800/50 border border-slate-700/50 mt-4">
                                <div className="text-sm font-medium text-slate-200 mb-2">Equivalencia de Impacto</div>
                                <div className="text-xs text-slate-400">
                                  La captura de CO2 de estos manglares equivale a retirar aproximadamente 9,850
                                  vehículos de circulación durante un año completo.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <h3 className="text-sm font-medium text-slate-300 mb-3">Proyectos de Mejora</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ActionCard
                              title="Ampliación de Manglares"
                              description="Expansión de áreas de manglar para aumentar captura"
                              status="Planificado"
                              progress={25}
                            />
                            <ActionCard
                              title="Certificación de Carbono"
                              description="Proceso de certificación para bonos de carbono"
                              status="En progreso"
                              progress={60}
                            />
                            <ActionCard
                              title="Monitoreo Avanzado"
                              description="Implementación de sensores de CO2 en tiempo real"
                              status="Activo"
                              progress={80}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Barra lateral derecha */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* Resumen del sistema */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">RESUMEN DEL SISTEMA</div>
                      <div className="text-2xl font-mono text-green-400 mb-1">Golfo de Urabá</div>
                      <div className="text-sm text-slate-400">Monitoreo de Manglares</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Última Actualización</div>
                        <div className="text-sm font-mono text-slate-200">15/03/2025</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Próxima Captura</div>
                        <div className="text-sm font-mono text-slate-200">17/03/2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alertas recientes */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                    Alertas Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AlertItem
                      title="Deforestación Detectada"
                      time="14:32:12"
                      description="5.2 ha en Norte del Golfo de Urabá"
                      type="error"
                    />
                    <AlertItem
                      title="Erosión Acelerada"
                      time="13:45:06"
                      description="Incremento de erosión en Playa Turbo"
                      type="warning"
                    />
                    <AlertItem
                      title="Avistamiento de Especies"
                      time="09:12:45"
                      description="Grupo de manatíes detectado en Bahía Colombia"
                      type="info"
                    />
                    <AlertItem
                      title="Reforestación Completada"
                      time="04:30:00"
                      description="2.5 ha reforestadas en Punta Caimán"
                      type="success"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Acciones rápidas */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={Download} label="Descargar Datos" />
                    <ActionButton icon={Radar} label="Escaneo Rápido" />
                    <ActionButton icon={MapPin} label="Marcar Punto" />
                    <ActionButton icon={Eye} label="Ver Alertas" />
                  </div>
                </CardContent>
              </Card>

              {/* Reportes programados */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Reportes Programados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="text-green-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Reporte Semanal</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Filter className="text-green-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Alertas por Email</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Info className="text-green-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Resumen Mensual</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Check className="text-green-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Verificación de Datos</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para elementos de navegación
function NavItem({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-green-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Componente para elementos de estado
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-teal-500"
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "red":
        return "from-red-500 to-pink-500"
      default:
        return "from-green-500 to-teal-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Componente para tarjetas de métricas
function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: string
  unit: string
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-teal-500 border-green-500/30"
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "red":
        return "from-red-500 to-pink-500 border-red-500/30"
      default:
        return "from-green-500 to-teal-500 border-green-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className={`h-4 w-4 ${color === "red" ? "text-red-500" : "text-green-500"}`} />
      case "down":
        return <BarChart3 className={`h-4 w-4 rotate-180 ${color === "red" ? "text-green-500" : "text-red-500"}`} />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color === "red" ? "red" : color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value} <span className="text-sm">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-green-500 to-teal-500"></div>
    </div>
  )
}

// Componente para botones de capas del mapa
function LayerButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-7 w-full justify-start px-2 ${
        active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-slate-400"
      }`}
      onClick={onClick}
    >
      <Layers className="mr-1 h-3 w-3" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Componente para elementos de alerta
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: Check, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Componente para tarjetas de acción
function ActionCard({
  title,
  description,
  status,
  progress,
}: {
  title: string
  description: string
  status: string
  progress: number
}) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "activo":
      case "completado":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "en progreso":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "planificado":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-200">{title}</div>
        <Badge className={getStatusColor()}>{status}</Badge>
      </div>
      <div className="text-xs text-slate-400 mb-3">{description}</div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-500">Progreso</div>
        <div className="text-xs text-slate-400">{progress}%</div>
      </div>
      <Progress value={progress} className="h-1.5 bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  )
}

// Componente para botones de acción
function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-green-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Gráfico de deforestación
function DeforestationChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Etiquetas del eje Y */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">25 ha</div>
        <div className="text-xs text-slate-500">20 ha</div>
        <div className="text-xs text-slate-500">15 ha</div>
        <div className="text-xs text-slate-500">10 ha</div>
        <div className="text-xs text-slate-500">5 ha</div>
        <div className="text-xs text-slate-500">0 ha</div>
      </div>

      {/* Líneas de cuadrícula del eje X */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Barras del gráfico */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 12 }).map((_, i) => {
          const height = Math.floor(Math.random() * 60) + 10

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-6 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Etiquetas del eje X */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">Ene</div>
        <div className="text-xs text-slate-500">Feb</div>
        <div className="text-xs text-slate-500">Mar</div>
        <div className="text-xs text-slate-500">Abr</div>
        <div className="text-xs text-slate-500">May</div>
        <div className="text-xs text-slate-500">Jun</div>
        <div className="text-xs text-slate-500">Jul</div>
        <div className="text-xs text-slate-500">Ago</div>
        <div className="text-xs text-slate-500">Sep</div>
        <div className="text-xs text-slate-500">Oct</div>
        <div className="text-xs text-slate-500">Nov</div>
        <div className="text-xs text-slate-500">Dic</div>
      </div>
    </div>
  )
}

// Gráfico de biodiversidad
function BiodiversityChart() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center text-slate-400 text-sm">
        Gráfico de distribución de especies
        <div className="mt-2 text-xs text-slate-500">
          Visualización de la distribución de especies en el ecosistema de manglares
        </div>
      </div>
    </div>
  )
}

// Gráfico de erosión
function ErosionChart() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center text-slate-400 text-sm">
        Gráfico de tendencia de erosión costera
        <div className="mt-2 text-xs text-slate-500">
          Visualización de la tasa de erosión en diferentes áreas del Golfo de Urabá
        </div>
      </div>
    </div>
  )
}

// Gráfico de captura de CO2
function CO2Chart({ data }: { data: CO2CaptureData[] }) {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Etiquetas del eje Y */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">4000 ton</div>
        <div className="text-xs text-slate-500">3000 ton</div>
        <div className="text-xs text-slate-500">2000 ton</div>
        <div className="text-xs text-slate-500">1000 ton</div>
        <div className="text-xs text-slate-500">0 ton</div>
      </div>

      {/* Líneas de cuadrícula del eje X */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Barras del gráfico */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {data.map((item, i) => {
          const height = (item.value / 4000) * 100

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-6 bg-gradient-to-t from-green-500 to-teal-400 rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Etiquetas del eje X */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        {data.map((item, i) => (
          <div key={i} className="text-xs text-slate-500">
            {item.month}
          </div>
        ))}
      </div>
    </div>
  )
}

