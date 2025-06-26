/**
 * @typedef {Object} UseMediaStreamResult
 * @property {"webcam" | "screen"} type - The type of media stream.
 * @property {() => Promise<MediaStream>} start - Function to start the stream.
 * @property {() => void} stop - Function to stop the stream.
 * @property {boolean} isStreaming - Whether streaming is active.
 * @property {MediaStream | null} stream - The media stream object.
 */
