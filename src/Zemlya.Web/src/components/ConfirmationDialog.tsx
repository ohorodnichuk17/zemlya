import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ConfirmationDialog = (props:{
    dialogTitle : string,
    dialogContent : string,
    isOpen : boolean,
    handleClose : () => void,
    handleAgree : () => void
}) => {

    return (
        <Dialog 
            open={props.isOpen}
            keepMounted
            onClose={props.handleClose}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    maxWidth: '440px',
                    width: '100%'
                }
            }}
        >

            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                fontWeight: 800, 
                color: '#D32F2F', 
                fontSize: '1.25rem',
                pb: 1
            }}>
                <WarningAmberIcon sx={{ color: '#D32F2F', fontSize: '28px' }} />
                {props.dialogTitle}
            </DialogTitle>
            
            <DialogContent sx={{ py: 1 }}>
                <DialogContentText sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {props.dialogContent}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 1, gap: 1.5 }}>
                <Button 
                    onClick={props.handleClose}
                    variant="outlined"
                    sx={{
                        borderColor: '#C8E6C9',
                        color: '#2E7D32',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '8px',
                        px: 3,
                        py: 0.8,
                        '&:hover': {
                            borderColor: '#81C784',
                            backgroundColor: '#E8F5E9'
                        }
                    }}
                >
                    Ні, скасувати
                </Button>
                <Button 
                    onClick={props.handleAgree}
                    variant="contained"
                    sx={{
                        backgroundColor: '#D32F2F',
                        color: '#FFFFFF',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '8px',
                        px: 3,
                        py: 0.8,
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#B71C1C',
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                        }
                    }}
                >
                    Так, видалити
                </Button>
            </DialogActions>
        </Dialog>
    );
}