import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Box, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { ChevronLeft, Menu } from '@mui/icons-material';

export const ChatMain = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })<{
    open?: boolean;
    drawerWidth: string;
}>(({ theme, open, drawerWidth }) => ({
    flexGrow: 1,
    padding: 0,
    width: open ? `calc(100vw - ${drawerWidth})` : '100vw',
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

export interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    drawerWidth: string;
}

export const ChatAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth})`,
        marginLeft: `${drawerWidth}`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const ChatDrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const ChatDrawer = ({ drawerWidth, open, children }: {
    drawerWidth: string, open: boolean,
    children: React.ReactNode
}) => {
    const isMobile = useMediaQuery('(max-width: 600px)')
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
            PaperProps={{
                sx: {
                    marginTop: isMobile ? '57px' : '74px'
                }
            }}
        >
            {children}
        </Drawer>
    )
}

export const DrawerButton = ({ open, setOpen }: {
    open: boolean,
    setOpen: (open: boolean) => void
}) => {
    const isMobile = useMediaQuery('(max-width: 600px)')
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
        >
            {!open && !isMobile ? <Menu /> : <ChevronLeft />}
        </IconButton>
    )
}

export const ChatContainer = ({ drawerWidth, open, children, boxHeight }: {
    drawerWidth: string, open: boolean,
    children: React.ReactNode,
    boxHeight: React.RefObject<HTMLDivElement>
}) => {
    const isMobile = useMediaQuery('(max-width: 600px)')
    return (
        <ChatMain open={open} drawerWidth={drawerWidth}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    flexGrow: 1,
                    minHeight: 500,
                    border: '1px solid gray',
                    borderLeft: 0,
                    p: 0,
                    paddingTop: isMobile ? '22px' : '45px',
                    position: 'relative',
                }}
                ref={boxHeight}
            >
                {children}
            </Box>
        </ChatMain>
    )
}