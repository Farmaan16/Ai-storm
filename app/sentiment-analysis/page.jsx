'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import '@tensorflow/tfjs'
import * as toxicity from '@tensorflow-models/toxicity'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SentimentAnalysis() {
  const [sentence, setSentence] = useState('')
  const [sentiment, setSentiment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)

  const analyzeSentiment = async (text) => {
    setLoading(true)
    setError(null)

    try {
      const threshold = 0.9
      const model = await toxicity.load(threshold)
      const predictions = await model.classify(text)

      setSentiment(predictions)
      addToHistory(text, predictions)
    } catch (err) {
      setError('Error analyzing the sentence. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addToHistory = (text, predictions) => {
    setHistory([ 
      { text, sentiment: predictions, timestamp: new Date().toLocaleString() },
      ...history,
    ].slice(0, 5)) // Keep only the last 5 entries
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (sentence.trim()) {
      analyzeSentiment(sentence)
    }
  }

  const handleClearResults = () => {
    setSentence('')
    setSentiment(null)
    setHistory([])
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Sentiment Analysis
        </h1>

        <Card className="bg-zinc-800 border-zinc-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-100">Analyze Your Text</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Type a sentence to analyze..."
                rows={5}
                className="w-full bg-zinc-700 border-zinc-600 text-zinc-100 placeholder-zinc-400"
              />
              <div className="flex justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Sentiment'
                  )}
                </Button>
                <Button
                  onClick={handleClearResults}
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  Clear Results
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-900 border-red-700 mb-8">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {sentiment && (
          <Card className="bg-zinc-800 border-zinc-700 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <Pie data={preparePieData(sentiment)} options={chartOptions} />
              </div>
              <ul className="space-y-2">
                {sentiment.map((prediction, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 bg-zinc-700 rounded">
                    <span className="font-medium">{prediction.label}</span>
                    <div className="flex items-center">
                      {prediction.results[0].match ? (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span className={prediction.results[0].match ? 'text-red-400' : 'text-green-400'}>
                        {prediction.results[0].match ? 'Toxic' : 'Non-Toxic'}
                      </span>
                      <span className="ml-2 text-zinc-400">
                        ({Math.round(prediction.results[0].probabilities[1] * 100)}%)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100">Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {history.map((entry, idx) => (
                  <li key={idx} className="p-4 bg-zinc-700 rounded-lg">
                    <div className="font-semibold text-zinc-100 mb-2">{entry.text}</div>
                    <div className="text-sm text-zinc-400 mb-2">{entry.timestamp}</div>
                    <ul className="space-y-1">
                      {entry.sentiment.map((prediction, predIdx) => (
                        <li key={predIdx} className="flex justify-between text-sm">
                          <span className="text-zinc-300">{prediction.label}:</span>
                          <span className={prediction.results[0].match ? 'text-red-400' : 'text-green-400'}>
                            {prediction.results[0].match ? 'Toxic' : 'Non-Toxic'}
                            {' '}
                            ({Math.round(prediction.results[0].probabilities[1] * 100)}%)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

const preparePieData = (predictions) => {
  const labels = predictions.map((prediction) => prediction.label)
  const values = predictions.map(
    (prediction) => prediction.results[0].probabilities[1] * 100
  )

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(214, 211, 209)', // text-zinc-300
      },
    },
    tooltip: {
      backgroundColor: 'rgb(63, 63, 70)', // bg-zinc-700
      titleColor: 'rgb(244, 244, 245)', // text-zinc-100
      bodyColor: 'rgb(161, 161, 170)', // text-zinc-400
      borderColor: 'rgb(113, 113, 122)', // border-zinc-500
      borderWidth: 1,
    },
  },
}
