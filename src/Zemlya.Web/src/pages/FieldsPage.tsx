import { Box, Button, Container, Pagination, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { getFieldsAsync } from "../redux/actions/fieldsActions";
import type { IPagination } from "../interfaces/general";
import { CardComponent } from "../components/CardComponent";

export const FieldsPage = () => {

   const [pagination, setPagination] = useState<IPagination>({ page: 0, sizeOfPage: 3 });
   const dispatch = useAppDispatch();
   const paginationFieldsResponse = useAppSelector(state => state.fieldsReducer.paginationFieldsResponse);

   useEffect(() => {
      dispatch(getFieldsAsync(pagination));
   }, [pagination]);
   useEffect(() => {
      console.log(paginationFieldsResponse);
   }, [paginationFieldsResponse]);
   return (
      <Container sx={{
         display: 'flex',
         flexDirection: 'column',
         height: '100%',
         width: '100%',
         backgroundColor: '#E8F5E9',
         padding: "20px 50px",
         boxSizing: "border-box"
      }}>
         <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
            <Typography variant="h2" component="h1" gutterBottom>
               Поля
            </Typography>
            <Button sx={{ marginLeft: 'auto', height: '40px' }} variant="text">Додати поле</Button>
         </Box>

         <Box
            sx={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
               overflowY: 'auto',
               overflowX: 'hidden',
               flex: 1,
               gap: '20px',
               maxHeight: '450px',
               width: '100%',
               minWidth: '300px',
               marginBottom: '20px',
               boxSizing: 'border-box',
               alignItems: 'center',
               justifyItems: 'center',
            }}
         >
            {paginationFieldsResponse != null && paginationFieldsResponse.fields != null && paginationFieldsResponse.fields.map((field) => (
               <><CardComponent key={field.id} cardInfo={field} />
               </>
            ))}

         </Box>
         <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
         }}>
            {paginationFieldsResponse != null
               && paginationFieldsResponse.totalCount > pagination.sizeOfPage
               && <Pagination
                  page={pagination.page + 1}
                  count={Math.ceil(paginationFieldsResponse.totalCount / pagination.sizeOfPage)}
                  onChange={(_, page) => setPagination({ ...pagination, page: page - 1 })} />}
         </Box>

      </Container>
   )
}
