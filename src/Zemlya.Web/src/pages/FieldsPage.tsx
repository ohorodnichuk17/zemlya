import { Box, Button, Container, MenuItem, Pagination, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { archiveFieldAsync, getFieldsAsync, removeFieldAsync, unarchiveFieldAsync } from "../redux/actions/fieldsActions";
import type { IPagination } from "../interfaces/general";
import { CardComponent } from "../components/CardComponent";
import AddIcon from '@mui/icons-material/Add';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { FieldFormModal } from "../components/FieldFormModal";
import type { IFieldEdit } from "../interfaces/fields/fields";
import { crops, shellingImpactLevels, soils } from "../types/dataTypes";

export const FieldsPage = () => {
   const [pagination, setPagination] = useState<IPagination>({ isArchived: false, page: 0, sizeOfPage: 6 });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalMode, setModalMode] = useState<"create" | "edit">("create");
   const [editFieldModel, setEditFieldModel] = useState<IFieldEdit | undefined>(undefined);
   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
   const [deletedFieldName, setDeletedFieldName] = useState("");
   const [deletedFieldId, setDeletedFieldId] = useState("");

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
         height: '100%',
         backgroundColor: '#F1F8E9',

         padding: "40px 24px",
         boxSizing: "border-box"
      }}>
         <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginBottom: '32px',
            columnGap: "10px"
         }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1B5E20' }}>
               Мої Агроділянки
            </Typography>

            <TextField
               sx={{ marginLeft: 'auto', borderRadius: "20px", height: "100%" }}
               select
               value={Number(pagination.isArchived)}
               onChange={(e) => {
                  setPagination({
                     page: 0,
                     sizeOfPage: 6,
                     isArchived: Boolean(e.target.value)
                  });
               }}>
               <MenuItem value={0}>Не архівовані</MenuItem>
               <MenuItem value={1}>Архівовані</MenuItem>
            </TextField>

            <Button
               sx={{
                  height: '42px',
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px'
               }}
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => {
                  setModalMode("create");
                  setIsModalOpen(true)
               }}
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
               <CardComponent
                  key={field.id}
                  cardInfo={field}
                  archiveUnarchiveHandler={async () => {
                     await dispatch(pagination.isArchived == false ? archiveFieldAsync(field.id) : unarchiveFieldAsync(field.id));
                     if (paginationFieldsResponse.fields.length <= 1) {
                        setPagination({
                           ...pagination,
                           page: 0,
                           sizeOfPage: 6,
                        })
                     }
                     else {
                        refreshFields();
                     }

                  }}
                  editHandler={() => {
                     setModalMode("edit");
                     setEditFieldModel({
                        id: field.id,
                        name: field.name,
                        cropType: crops[field.cropType].index.toString(),
                        soilType: soils[field.soilType].index.toString(),
                        sizeHectares: field.sizeHectares,
                        latitude: field.latitude,
                        longitude: field.longitude,
                        oblast: field.oblast,
                        shellingImpactLevel: shellingImpactLevels[field.shellingImpactLevel].index.toString(),
                        sowingDate: new Date(field.sowingDate).toISOString().split('T')[0]
                     })
                     setIsModalOpen(true);
                  }}
                  removeHandler={async () => {
                     setIsConfirmationOpen(true);
                     setDeletedFieldName(field.name);
                     setDeletedFieldId(field.id);

                  }}
               />

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

         
         <FieldFormModal
            open={isModalOpen}
            mode={modalMode}
            onClose={() => {
               setIsModalOpen(false)
            }}
            onSubmitSuccess={() => {
               setIsModalOpen(false);
               refreshFields();
            }}
            field={editFieldModel}
         >

         </FieldFormModal>
         <ConfirmationDialog
            dialogTitle="Видалення поля"
            dialogContent={`Ви впевнені що хочете видалити поле "${deletedFieldName}"`}
            isOpen={isConfirmationOpen}
            handleClose={() => {
               setIsConfirmationOpen(false);
               setDeletedFieldName("");
               setDeletedFieldId("");
            }}
            handleAgree={async () => {
               if (deletedFieldId !== "") {
                  await dispatch(removeFieldAsync(deletedFieldId));
                  refreshFields();
               }
               setIsConfirmationOpen(false);
               setDeletedFieldName("");
               setDeletedFieldId("");
            }}
         >
         </ConfirmationDialog>
      </Container>
   )
}
