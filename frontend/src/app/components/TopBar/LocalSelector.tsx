import Image from 'next/image'
import useStore from '@/store/useStore'
import { ReactNode } from 'react'
import { LanguageCode, supportedLangs } from '@/lib/translations'
import { Box, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material'

const LocaleSelector = (): ReactNode => {
  const language = useStore((state) => state.language)
  const setLanguage = useStore((state) => state.setLanguage)

  return (
    <Box>
      <Select
        sx={{ '& .MuiSelect-select': { display: 'flex' } }}
        variant='standard'
        disableUnderline
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        renderValue={(lang) => <Image src={`/${lang === 'en' ? 'us' : lang}.png`} alt={lang} width={30} height={20} />}
      >
        {supportedLangs.map((lang) => (
          <MenuItem value={lang} key={lang}>
            <ListItemIcon>
              <Image src={`/${lang === 'en' ? 'us' : lang}.png`} alt={lang} width={30} height={20} />
            </ListItemIcon>
            <ListItemText
              sx={{ textTransform: 'capitalize' }}
              primary={
                lang === 'lk'
                  ? 'Tamil'
                  : new Intl.DisplayNames(lang, {
                      type: 'language'
                    }).of(lang)
              }
            />
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export default LocaleSelector
