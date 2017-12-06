import openSocket from 'socket.io-client'
import config from './config'

export const sessionReasons = new Map([
  ['DEBUGGING', 'Debugging'],
  ['SYNTAX', 'Syntax'],
  ['CONCEPT', 'Concept'],
  ['PROGRAM_DESIGN', 'Program Design']
])

export const sessionTags = new Map([
  ['DEBUGGING', 'Debugging'],
  ['FUNCTIONS', 'Functions'],
  ['CLASSES', 'Classes']
])

export const socket = openSocket(config.socketURL)
