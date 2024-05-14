export type LanguageCode = 'en' | 'de'
// export type LanguageCode = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'nl' | 'lk'

const messages = {
  en: {
    'Chat': 'Chat',
    'Calendar': 'Calendar',
    'Meetings': 'Meetings',
    'Chats': 'Chats',
    'Welcome': 'Welcome',
    'Chat started!': 'Chat started!',
    'Cleat all chats': 'Clear all chats',
    'Delete chats': 'Delete chats',
    'Cancel': 'Cancel',
    'Today': 'Today',
    'Yesterday': 'Yesterday',
    'Day before yesterday': 'Day before yesterday',
    'Tomorrow': 'Tomorrow',
    'Day after tomorrow': 'Day after tomorrow',
    'Type your message': 'Type your message',
    'You': 'You',
    'Group': 'Group',
    'Search': 'Search',
    'has join the chat': 'has join the chat',
    'Reactions': 'Reactions',
    'click to delete': 'click to delete',
    'Footer text': 'Created by @YeonV aka Blade',
    'Profile': 'Profile',
    'Message': 'Message',
    'Messages': 'Messages',
    'Recently Used': 'Recently Used',
    'Smileys': 'Smileys',
    'Animals': 'Animals',
    'Food': 'Food',
    'Activities': 'Activities',
    'Travel': 'Travel',
    'Objects': 'Objects',
    'Symbols': 'Symbols',
    'Flags': 'Flags',
    'Clear DisplayName': 'Clear DisplayName',
    'welcome-title-overline': 'Realtime',
    'welcome-title': 'AppStack',
    'welcome-description':
      'A full-stack app with Next.js v14.1.4 + AppRouter, realtime communication via NextWs, backend via Strapi v4.24.1 and everything dockerized.',
    'welcome-sign-in': 'Sign in to get started',
    'welcome-signed-in': 'Successfully signed in',
    'Test Snackbar': 'Test Snackbar',
    'Toggle DarkMode': 'Toggle DarkMode'
  },
  de: {
    'Chat': 'Chat',
    'Calendar': 'Kalender',
    'Meetings': 'Termine',
    'Chats': 'Chats',
    'Welcome': 'Willkommen',
    'Chat started!': 'Chat gestartet!',
    'Cleat all chats': 'Alle Chats löschen',
    'Delete chats': 'Chats löschen',
    'Cancel': 'Abbrechen',
    'Today': 'Heute',
    'Yesterday': 'Gestern',
    'Day before yesterday': 'Vorgestern',
    'Tomorrow': 'Morgen',
    'Day after tomorrow': 'Übermorgen',
    'Type your message': 'Gib eine Nachricht ein.',
    'You': 'Du',
    'Group': 'Gruppe',
    'Search': 'Suchen',
    'has join the chat': 'hat den Chat betreten',
    'Reactions': 'Reaktionen',
    'click to delete': 'Zum entfernen klicken',
    'Footer text': 'von @YeonV aka Blade',
    'Profile': 'Profil',
    'Message': 'Nachricht',
    'Messages': 'Nachrichten',
    'Recently Used': 'Zuletzt verwendet',
    'Smileys': 'Smileys',
    'Animals': 'Tiere',
    'Food': 'Essen',
    'Activities': 'Aktivitäten',
    'Travel': 'Reisen',
    'Objects': 'Objekte',
    'Symbols': 'Symbole',
    'Flags': 'Flaggen',
    'Clear DisplayName': 'DisplayName löschen',
    'welcome-title-overline': 'Echtzeit',
    'welcome-title': 'AppStack',
    'welcome-description':
      'Eine Full-Stack-App mit Next.js v14.1.4 + AppRouter, Echtzeitkommunikation über NextWs, Backend über Strapi v4.24.1 und alles dockerisiert.',
    'welcome-sign-in': 'Anmelden um zu beginnen',
    'welcome-signed-in': 'Erfolgreich angemeldet',
    'Test Snackbar': 'Snackbar testen',
    'Toggle DarkMode': 'DarkMode umschalten'
  }
  // fr: {
  //   'Chat': 'Chat',
  //   'Chats': 'Chats',
  //   'Welcome': 'Bienvenue',
  //   'Chat started!': 'Chat commencé!',
  //   'Cleat all chats': 'Effacer tous les chats',
  //   'Delete chats': 'Supprimer les chats',
  //   'Cancel': 'Annuler',
  //   'Today': "Aujourd'hui",
  //   'Yesterday': 'Hier',
  //   'Day before yesterday': 'Avant-hier',
  //   'Tomorrow': 'Demain',
  //   'Day after tomorrow': 'Après-demain',
  //   'Type your message': 'Tapez votre message',
  //   'You': 'Vous',
  //   'Group': 'Groupe',
  //   'Search': 'Chercher',
  //   'has join the chat': 'a rejoint le chat',
  //   'Reactions': 'Réactions',
  //   'click to delete': 'cliquez pour supprimer',
  //   'Footer text': 'Créé par @YeonV aka Blade',
  //   'Profile': 'Profil',
  //   'Message': 'Message',
  //   'Messages': 'Messages',
  //   'Recently Used': 'Récemment utilisé',
  //   'Smileys': 'Émoticônes',
  //   'Animals': 'Animaux',
  //   'Food': 'Nourriture',
  //   'Activities': 'Activités',
  //   'Travel': 'Voyage',
  //   'Objects': 'Objets',
  //   'Symbols': 'Symboles',
  //   'Flags': 'Drapeaux'
  // },
  // it: {
  //   'Chat': 'Chat',
  //   'Chats': 'Chat',
  //   'Welcome': 'Benvenuto',
  //   'Chat started!': 'Chat iniziata!',
  //   'Cleat all chats': 'Cancella tutte le chat',
  //   'Delete chats': 'Elimina chat',
  //   'Cancel': 'Annulla',
  //   'Today': 'Oggi',
  //   'Yesterday': 'Ieri',
  //   'Day before yesterday': "L'altro ieri",
  //   'Tomorrow': 'Domani',
  //   'Day after tomorrow': 'Dopodomani',
  //   'Type your message': 'Scrivi il tuo messaggio',
  //   'You': 'Tu',
  //   'Group': 'Gruppo',
  //   'Search': 'Cerca',
  //   'has join the chat': 'ha partecipato alla chat',
  //   'Reactions': 'Reazioni',
  //   'click to delete': 'clicca per eliminare',
  //   'Footer text': 'Creato da @YeonV aka Blade',
  //   'Profile': 'Profilo',
  //   'Message': 'Messaggio',
  //   'Messages': 'Messaggi',
  //   'Recently Used': 'Usati di recente',
  //   'Smileys': 'Faccine',
  //   'Animals': 'Animali',
  //   'Food': 'Cibo',
  //   'Activities': 'Attività',
  //   'Travel': 'Viaggi',
  //   'Objects': 'Oggetti',
  //   'Symbols': 'Simboli',
  //   'Flags': 'Bandiere'
  // },
  // es: {
  //   'Chat': 'Chat',
  //   'Chats': 'Chats',
  //   'Welcome': 'Bienvenido',
  //   'Chat started!': '¡Chat iniciado!',
  //   'Cleat all chats': 'Borrar todos los chats',
  //   'Delete chats': 'Eliminar chats',
  //   'Cancel': 'Cancelar',
  //   'Today': 'Hoy',
  //   'Yesterday': 'Ayer',
  //   'Day before yesterday': 'Anteayer',
  //   'Tomorrow': 'Mañana',
  //   'Day after tomorrow': 'Pasado mañana',
  //   'Type your message': 'Escribe tu mensaje',
  //   'You': 'Tú',
  //   'Group': 'Grupo',
  //   'Search': 'Buscar',
  //   'has join the chat': 'se ha unido al chat',
  //   'Reactions': 'Reacciones',
  //   'click to delete': 'haga clic para eliminar',
  //   'Footer text': 'Creado por @YeonV aka Blade',
  //   'Profile': 'Perfil',
  //   'Message': 'Mensaje',
  //   'Messages': 'Mensajes',
  //   'Recently Used': 'Recientemente utilizado',
  //   'Smileys': 'Caritas',
  //   'Animals': 'Animales',
  //   'Food': 'Comida',
  //   'Activities': 'Actividades',
  //   'Travel': 'Viajes',
  //   'Objects': 'Objetos',
  //   'Symbols': 'Símbolos',
  //   'Flags': 'Banderas'
  // },
  // pt: {
  //   'Chat': 'Chat',
  //   'Chats': 'Chats',
  //   'Welcome': 'Bem-vindo',
  //   'Chat started!': 'Chat iniciado!',
  //   'Cleat all chats': 'Limpar todos os chats',
  //   'Delete chats': 'Excluir chats',
  //   'Cancel': 'Cancelar',
  //   'Today': 'Hoje',
  //   'Yesterday': 'Ontem',
  //   'Day before yesterday': 'Anteontem',
  //   'Tomorrow': 'Amanhã',
  //   'Day after tomorrow': 'Depois de amanhã',
  //   'Type your message': 'Digite sua mensagem',
  //   'You': 'Você',
  //   'Group': 'Grupo',
  //   'Search': 'Procurar',
  //   'has join the chat': 'entrou no chat',
  //   'Reactions': 'Reações',
  //   'click to delete': 'clique para excluir',
  //   'Footer text': 'Criado por @YeonV aka Blade',
  //   'Profile': 'Perfil',
  //   'Message': 'Mensagem',
  //   'Messages': 'Mensagens',
  //   'Recently Used': 'Usado recentemente',
  //   'Smileys': 'Emoticons',
  //   'Animals': 'Animais',
  //   'Food': 'Comida',
  //   'Activities': 'Atividades',
  //   'Travel': 'Viagem',
  //   'Objects': 'Objetos',
  //   'Symbols': 'Símbolos',
  //   'Flags': 'Bandeiras'
  // },
  // nl: {
  //   'Chat': 'Chat',
  //   'Chats': 'Chats',
  //   'Welcome': 'Welkom',
  //   'Chat started!': 'Chat gestart!',
  //   'Cleat all chats': 'Wis alle chats',
  //   'Delete chats': 'Chats verwijderen',
  //   'Cancel': 'Annuleren',
  //   'Today': 'Vandaag',
  //   'Yesterday': 'Gisteren',
  //   'Day before yesterday': 'Eergisteren',
  //   'Tomorrow': 'Morgen',
  //   'Day after tomorrow': 'Overmorgen',
  //   'Type your message': 'Typ je bericht',
  //   'You': 'Jij',
  //   'Group': 'Groep',
  //   'Search': 'Zoeken',
  //   'has join the chat': 'heeft de chat betreden',
  //   'Reactions': 'Reacties',
  //   'click to delete': 'klik om te verwijderen',
  //   'Footer text': 'Gemaakt door @YeonV aka Blade',
  //   'Profile': 'Profiel',
  //   'Message': 'Bericht',
  //   'Messages': 'Berichten',
  //   'Recently Used': 'Recent gebruikt',
  //   'Smileys': 'Smileys',
  //   'Animals': 'Dieren',
  //   'Food': 'Eten',
  //   'Activities': 'Activiteiten',
  //   'Travel': 'Reizen',
  //   'Objects': 'Objecten',
  //   'Symbols': 'Symbolen',
  //   'Flags': 'Vlaggen'
  // },
  // lk: {
  //   'Chat': 'කතා',
  //   'Chats': 'කතා',
  //   'Welcome': 'ආයුබෝවන්',
  //   'Chat started!': 'කතා ආරම්භයි!',
  //   'Cleat all chats': 'සියලුම කතා මකන්න',
  //   'Delete chats': 'කතා මකන්න',
  //   'Cancel': 'අවලංගු',
  //   'Today': 'අද',
  //   'Yesterday': 'ඊයේ',
  //   'Day before yesterday': 'පෙරදා',
  //   'Tomorrow': 'හෙට',
  //   'Day after tomorrow': 'හෙට පසු',
  //   'Type your message': 'ඔබගේ පණිවුඩය ටයිප් කරන්න',
  //   'You': 'ඔබ',
  //   'Group': 'සමූහය',
  //   'Search': 'සොයන්න',
  //   'has join the chat': 'කතාට එක් වූවා',
  //   'Reactions': 'ප්‍රතිලාභ',
  //   'click to delete': 'මකා දැමීමට ක්ලික් කරන්න',
  //   'Footer text': 'නිර්දේශිතයා @YeonV aka Blade',
  //   'Profile': 'විශ්ලේෂණ',
  //   'Message': 'පණිවුඩය',
  //   'Messages': 'පණිවුඩ',
  //   'Recently Used': 'මෑතදී භාවිතා කරන ලදි',
  //   'Smileys': 'සිරස්',
  //   'Animals': 'කුරුල්',
  //   'Food': 'ආහළ',
  //   'Activities': 'ක්‍රියාකාරී',
  //   'Travel': 'ගමන්',
  //   'Objects': 'අයිතම',
  //   'Symbols': 'සංකේත',
  //   'Flags': 'ගීත'
  // }
}

export const supportedLangs: LanguageCode[] = Object.keys(messages) as LanguageCode[]

export default messages
