import { FetchOptionsType } from '@/types/strapi/StrapiFetchOptions'
import { IApiParameters } from '@/types/strapi/StrapiParameters'
import { StrapiErrorT } from '@/types/strapi/StrapiError'
import qs from 'qs'

const api = async (path: string, strapiToken?: string, parameters?: IApiParameters, options?: FetchOptionsType) => {
  const url = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL + `/api${path}?` + qs.stringify(parameters, { encodeValuesOnly: true })

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${strapiToken}`
    }
  }
  try {
    const strapiResponse = await fetch(url, { ...defaultOptions, ...options })
    // console.log(strapiResponse)
    if (!strapiResponse.ok) {
      // check if response in json-able
      const contentType = strapiResponse.headers.get('content-type')
      if (contentType === 'application/json; charset=utf-8') {
        const errorData: StrapiErrorT = await strapiResponse.json()
        throw new Error(`${errorData.error.status} ${errorData.error.name}: ${errorData.error.message}`)
      } else {
        // If no Strapi error details, throw a generic HTTP error
        throw new Error(`HTTP Error: ${strapiResponse.status} - ${strapiResponse.statusText}`)
      }
    }

    // success
    const successData = await strapiResponse.json()
    return successData
  } catch (error) {
    throw error
  }
}

export default api
