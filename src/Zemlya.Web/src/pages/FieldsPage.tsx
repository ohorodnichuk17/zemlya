import { Box, Button, Container, Pagination, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { getFieldsAsync } from "../redux/actions/fieldsActions";
import type { IPagination } from "../interfaces/general";
import { CardComponent } from "../components/CardComponent";
import { AddFieldModal } from "../components/AddFieldModal";
import AddIcon from '@mui/icons-material/Add';

export const FieldsPage = () => {
   const [pagination, setPagination] = useState<IPagination>({ page: 0, sizeOfPage: 6 });
   const [isModalOpen, setIsModalOpen] = useState(false);

   const dispatch = useAppDispatch();
   const paginationFieldsResponse = useAppSelector(state => state.fieldsReducer.paginationFieldsResponse);

   const refreshFields = () => {
      dispatch(getFieldsAsync(pagination));
   };

   useEffect(() => {
      refreshFields();
   }, [pagination]);

   return (
      <Container sx={{
         display: 'flex',
         flexDirection: 'column',
         flexGrow: 1,
         width: '100%',
         backgroundColor: '#F1F8E9',
         padding: "40px 24px",
         boxSizing: "border-box"
      }}>
         <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1B5E20' }}>
               Мої Агроділянки
            </Typography>
            <Button
               sx={{
                  marginLeft: 'auto',
                  height: '42px',
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px'
               }}
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => setIsModalOpen(true)}
            >
               Додати поле
            </Button>
         </Box>

         <Box
            sx={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
               gap: '24px',
               width: '100%',
               marginBottom: '32px',
               boxSizing: 'border-box',
               justifyItems: 'center',
            }}
         >
            {paginationFieldsResponse != null && paginationFieldsResponse.fields != null && paginationFieldsResponse.fields.map((field) => (
               <CardComponent key={field.id} cardInfo={field} />
            ))}
         </Box>

         <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '20px'
         }}>
            {paginationFieldsResponse != null
               && paginationFieldsResponse.totalCount > pagination.sizeOfPage
               && <Pagination
                  page={pagination.page + 1}
                  count={Math.ceil(paginationFieldsResponse.totalCount / pagination.sizeOfPage)}
                  onChange={(_, page) => setPagination({ ...pagination, page: page - 1 })}
                  sx={{
                     '& .Mui-selected': {
                        backgroundColor: '#2E7D32 !important',
                        color: '#FFF'
                     }
                  }}
               />}
         </Box>

         <AddFieldModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmitSuccess={() => {
               setIsModalOpen(false);
               refreshFields();
            }}
         />
      </Container>
   )
}
