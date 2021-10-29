import { execSync } from 'child_process'
import glob from 'glob'
import fs from 'fs'
import packageJson from '../package.json'
import path from 'path'

const exec = (command: string) => execSync(command, {encoding: 'utf-8'})

const API_FILENAME = 'internals.ts'
const API_PROJECT_FILENAME = 'tsconfig.internals.json'
const SEARCH_EXTENSIONS_PATH = './src/'

const FgGreen = '\x1b[32m%s\x1b[0m'

export const getExtensionsWithApi = function (src: string, callback: (error: any, result: any[]) => void) {
  try {
    const result = glob.sync(`${src}**/${API_FILENAME}`)
    callback(false, result)

  } catch (error) {
    callback(error, [])
  }
}

// exit with error code on error
const handleError = (error: any) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

// emit types with tsc
const emitTypes = (extensionEntry: string) => {
  const extensionPath = path.dirname(extensionEntry)
  try {
    createTSConfig(extensionPath)
    const tsProject = extensionPath + '/' + API_PROJECT_FILENAME
    exec(`yarn tsc --project ${tsProject}`)
    console.log(FgGreen, tsProject + ': Success')
  } catch(error) {
    handleError(error)
  }
}

// emit all extensions types
getExtensionsWithApi(SEARCH_EXTENSIONS_PATH, function (error, result) {
  handleError(error)

  result.forEach(emitTypes)
})

glob('./public/@types-tmp/*', function(error, result) {
  result.forEach(source => {
    const destination = source.replace('@types-tmp', '@types')
    fs.rmSync(destination, { recursive: true, force: true })
    fs.renameSync(source, destination)
  })
  fs.rmSync('./public/@types-tmp', { recursive: true, force: true })
})

function createTSConfig(extensionPath: string) {

  const contentExample = fs.readFileSync('./tsconfig.internals.example.json', {encoding: 'utf-8'})
  const content = contentExample.replace('[extension-id]', packageJson.name)

  fs.writeFileSync(extensionPath + '/' + API_PROJECT_FILENAME, content, {encoding: 'utf-8'})
}
