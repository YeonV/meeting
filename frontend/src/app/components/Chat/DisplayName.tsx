import useStore from '@/store/useStore'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useRef } from 'react'

const DisplayName = () => {
    const setDisplayName = useStore(state => state.setDisplayName)
    const inputRef = useRef<HTMLInputElement>(null)

    return <Box height={'100vh'} display={'flex'}>
        <Stack spacing={2} direction={'row'} sx={{ m: 'auto' }}>
            <TextField label='Enter your display name' inputRef={inputRef} />
            <Button variant='contained' onClick={() => {
                if (inputRef.current && inputRef.current.value !== '') {
                    setDisplayName(inputRef.current.value)
                }
            }}>
                Set
            </Button>
        </Stack>
    </Box>
}

export default DisplayName