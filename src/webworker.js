importScripts('https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js')

async function loadPyodideAndPackages() {
  await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.17.0/full/',
  })
  await self.pyodide.loadPackage(['pandas'])
}
let pyodideReadyPromise = loadPyodideAndPackages()

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { python, ...context } = event.data
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key]
  }
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    self.postMessage({
      results: await self.pyodide.runPythonAsync(python),
    })
  } catch (error) {
    self.postMessage({ error: error.message })
  }
}
