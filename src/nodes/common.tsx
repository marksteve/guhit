import tw, { styled } from 'twin.macro'

export const NodeContainer = styled.div<{ selected: boolean }>(
  ({ selected }) => [
    tw`p-2 bg-white border flex flex-col`,
    selected && tw`border-blue-500`,
  ]
)


export const NodeLabel = tw.div`flex gap-x-1 border-b pb-2 mb-2`