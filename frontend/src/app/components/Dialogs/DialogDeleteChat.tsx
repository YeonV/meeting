import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useStore from '@/store/useStore'
import useTranslation from '@/lib/utils'
import { LanguageCode } from '@/lib/translations'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export default function DialogDeleteChat() {
  const open = useStore((state) => state.dialogs.deleteChat)
  const setDialogs = useStore((state) => state.setDialogs)
  const setOpen = (to: boolean) => setDialogs('deleteChat', to)
  const clearChats = useStore((state) => state.clearChats)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <BootstrapDialog
        PaperProps={{ sx: { minWidth: 480, p: '0.5rem 1rem 1rem' } }}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 4, fontSize: 26, fontWeight: 300 }} id='customized-dialog-title'>
          {t('Cleat all chats')}?
        </DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button variant='outlined' autoFocus onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              clearChats()
              handleClose()
            }}
          >
            {t('Delete chats')}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  )
}
