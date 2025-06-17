import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './App.css'

interface RawData {
  salesCode: string
  shop: string
  type: string | null
  sold: number
  week: number
  ca: number
  shrinkage: number
  grossMargin: number
  netMargin: number
  stock: number
  flow: number
}

// Nouveau type pour les données du graphique
interface ChartData {
  week: number
  sold: number
  ca: number
  shrinkage: number
  grossMargin: number
  netMargin: number
  stock: number
  flow: number
}

function App() {
  const [data, setData] = useState<ChartData[]>([])
  const [startWeek, setStartWeek] = useState<number>(1)
  const [endWeek, setEndWeek] = useState<number>(52)
  const [y1Field, setY1Field] = useState<string>('ca')
  const [y2Field, setY2Field] = useState<string>('stock')

  const yFields = [
    { value: 'sold', label: 'Vendus' },
    { value: 'ca', label: 'CA (€)' },
    { value: 'shrinkage', label: 'Casse' },
    { value: 'grossMargin', label: 'Marge brute' },
    { value: 'netMargin', label: 'Marge nette' },
    { value: 'stock', label: 'Stock' },
    { value: 'flow', label: 'Flux' },
  ]

  useEffect(() => {
    fetch('/fixtures/fixtures.json')
      .then(response => response.json())
      .then((jsonData: RawData[]) => {
        // On prend tous les champs nécessaires pour le graphique
        const filteredData = jsonData.reduce((acc: ChartData[], curr: RawData) => {
          const existingWeek = acc.find(item => item.week === curr.week)
          if (!existingWeek) {
            acc.push({
              week: curr.week,
              sold: curr.sold,
              ca: curr.ca,
              shrinkage: curr.shrinkage,
              grossMargin: curr.grossMargin,
              netMargin: curr.netMargin,
              stock: curr.stock,
              flow: curr.flow
            })
          }
          return acc
        }, [])
        const sortedData = filteredData.sort((a, b) => a.week - b.week)
        setData(sortedData)
        if (sortedData.length > 0) {
          setStartWeek(sortedData[0].week)
          setEndWeek(sortedData[sortedData.length - 1].week)
        }
      })
  }, [])

  const filtered = data.filter(d => d.week >= startWeek && d.week <= endWeek)

  return (
    <div style={{ width: '1200px', height: '800px', margin: '40px auto' }}>
      <h2>Évolution dynamique par semaine</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <label>
          Semaine de début :
          <select value={startWeek} onChange={e => setStartWeek(Number(e.target.value))}>
            {Array.from({ length: endWeek - data[0]?.week + 1 || 0 }, (_, i) => (data[0]?.week || 1) + i).map(week => (
              <option key={week} value={week} disabled={week > endWeek}>{week}</option>
            ))}
          </select>
        </label>
        <label>
          Semaine de fin :
          <select value={endWeek} onChange={e => setEndWeek(Number(e.target.value))}>
            {Array.from({ length: (data[data.length-1]?.week || 52) - startWeek + 1 }, (_, i) => startWeek + i).map(week => (
              <option key={week} value={week} disabled={week < startWeek}>{week}</option>
            ))}
          </select>
        </label>
        <label>
          Axe Y1 :
          <select value={y1Field} onChange={e => setY1Field(e.target.value)}>
            {yFields.map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
        </label>
        <label>
          Axe Y2 :
          <select value={y2Field} onChange={e => setY2Field(e.target.value)}>
            {yFields.map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
        </label>
      </div>
      <ResponsiveContainer>
        <LineChart
          data={filtered}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" label={{ value: 'Semaine', position: 'insideBottom', offset: -5 }} />
          <YAxis yAxisId="left" label={{ value: yFields.find(f => f.value === y1Field)?.label || y1Field, angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: yFields.find(f => f.value === y2Field)?.label || y2Field, angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={y1Field}
            stroke="#8884d8"
            name={yFields.find(f => f.value === y1Field)?.label || y1Field}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={y2Field}
            stroke="#82ca9d"
            name={yFields.find(f => f.value === y2Field)?.label || y2Field}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default App
