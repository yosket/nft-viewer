export const getCroppedAddress = (address: string): string => {
  const front = address.slice(0, 6)
  const end = address.slice(-4)
  return `${front}...${end}`
}
