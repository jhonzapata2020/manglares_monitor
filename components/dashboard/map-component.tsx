"use client"

import { useEffect, useState, useRef } from "react"
import { MapPin, AlertCircle, Leaf, Waves, Cloud } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// Definir las props del componente
type MapComponentProps = {
  selectedDate: string
  mapLayer: string
  onLayerChange: (layer: string) => void
  alerts?: DeforestationAlert[]
}

export default function MapComponent({ selectedDate, mapLayer, onLayerChange, alerts = [] }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<DeforestationAlert | null>(null)

  // Simular la carga del mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Cambiar la visualización del mapa según la capa seleccionada
  useEffect(() => {
    if (!isMapLoaded) return

    // Aquí se implementaría la lógica para cambiar las capas del mapa
    console.log(`Cambiando a capa: ${mapLayer}`)
  }, [mapLayer, isMapLoaded])

  // Actualizar el mapa cuando cambia la fecha seleccionada
  useEffect(() => {
    if (!isMapLoaded) return

    // Aquí se implementaría la lógica para actualizar el mapa según la fecha
    console.log(`Actualizando mapa para fecha: ${selectedDate}`)
  }, [selectedDate, isMapLoaded])

  // Función para manejar el clic en una alerta
  const handleAlertClick = (alert: DeforestationAlert) => {
    setSelectedAlert(alert)
  }

  // Función para cerrar el popup de alerta
  const handleCloseAlert = () => {
    setSelectedAlert(null)
  }

  // Obtener el color según la severidad de la alerta
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-500/20 border-red-500/30"
      case "medium":
        return "text-amber-500 bg-amber-500/20 border-amber-500/30"
      case "low":
        return "text-blue-500 bg-blue-500/20 border-blue-500/30"
      default:
        return "text-slate-500 bg-slate-500/20 border-slate-500/30"
    }
  }

  // Obtener el icono según la capa seleccionada
  const getLayerIcon = () => {
    switch (mapLayer) {
      case "deforestation":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "biodiversity":
        return <Leaf className="h-5 w-5 text-green-500" />
      case "erosion":
        return <Waves className="h-5 w-5 text-blue-500" />
      case "co2":
        return <Cloud className="h-5 w-5 text-cyan-500" />
      default:
        return <MapPin className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      {/* Mapa simulado */}
      <div
        ref={mapRef}
        className={`h-full w-full bg-slate-800 relative ${!isMapLoaded ? "animate-pulse" : ""}`}
        style={{
          backgroundImage: `url('/placeholder.svg?height=500&width=800')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-400">Cargando mapa...</div>
          </div>
        )}

        {isMapLoaded && (
          <>
            {/* Información de la capa actual */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
              <div className="flex items-center">
                {getLayerIcon()}
                <div className="ml-2">
                  <div className="text-sm font-medium text-slate-200">
                    {mapLayer === "satellite" && "Vista Satelital"}
                    {mapLayer === "deforestation" && "Deforestación"}
                    {mapLayer === "biodiversity" && "Biodiversidad"}
                    {mapLayer === "erosion" && "Erosión Costera"}
                    {mapLayer === "co2" && "Captura de CO2"}
                  </div>
                  <div className="text-xs text-slate-400">Fecha: {selectedDate}</div>
                </div>
              </div>
            </div>

            {/* Marcadores de alertas */}
            {mapLayer === "deforestation" &&
              alerts.map((alert) => (
                <TooltipProvider key={alert.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full ${
                          alert.severity === "high"
                            ? "bg-red-500/20 hover:bg-red-500/40"
                            : alert.severity === "medium"
                              ? "bg-amber-500/20 hover:bg-amber-500/40"
                              : "bg-blue-500/20 hover:bg-blue-500/40"
                        }`}
                        style={{
                          left: `${(alert.coordinates[1] + 77) * 10}%`,
                          top: `${(8.5 - alert.coordinates[0]) * 20}%`,
                        }}
                        onClick={() => handleAlertClick(alert)}
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${
                            alert.severity === "high"
                              ? "text-red-500"
                              : alert.severity === "medium"
                                ? "text-amber-500"
                                : "text-blue-500"
                          }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {alert.location} - {alert.area} ha
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

            {/* Popup de alerta seleccionada */}
            {selectedAlert && (
              <div
                className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-md p-3 border border-slate-700/50 max-w-xs"
                style={{ zIndex: 1000 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <AlertCircle
                      className={`h-4 w-4 mr-2 ${
                        selectedAlert.severity === "high"
                          ? "text-red-500"
                          : selectedAlert.severity === "medium"
                            ? "text-amber-500"
                            : "text-blue-500"
                      }`}
                    />
                    <div className="text-sm font-medium text-slate-200">{selectedAlert.location}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 -mt-1 -mr-1 text-slate-400"
                    onClick={handleCloseAlert}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fecha:</span>
                    <span className="text-slate-300">{selectedAlert.date}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Área afectada:</span>
                    <span className="text-slate-300">{selectedAlert.area} hectáreas</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Severidad:</span>
                    <Badge className={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity === "high"
                        ? "Alta"
                        : selectedAlert.severity === "medium"
                          ? "Media"
                          : "Baja"}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <span className="block mb-1">Descripción:</span>
                    <span className="text-slate-300">{selectedAlert.description}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

