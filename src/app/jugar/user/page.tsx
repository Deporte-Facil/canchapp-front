'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Collapse
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, AddCard as AddCardIcon, Save as SaveIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { TransitionGroup } from 'react-transition-group';

// Define the type for a Card object
interface CardData {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  last4Digits: string;
  timestamp: Date;
}

// Define the type for a PersonalData object
interface PersonalData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  timestamp: Date;
}

// Main App component
function App() {
  // Card management states
  const [cards, setCards] = useState<CardData[]>([]);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null); // Stores the ID of the card being edited
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // Type for card form validation errors

  // Personal data management states
  const [personalDataList, setPersonalDataList] = useState<PersonalData[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [editingPersonalId, setEditingPersonalId] = useState<string | null>(null); // Stores the ID of the personal data being edited
  const [openDeletePersonalDialog, setOpenDeletePersonalDialog] = useState<boolean>(false);
  const [personalToDelete, setPersonalToDelete] = useState<PersonalData | null>(null);
  const [personalFormErrors, setPersonalFormErrors] = useState<Record<string, string>>({}); // Type for personal form validation errors
  const [showPersonalForm, setShowPersonalForm] = useState<boolean>(false); // Controls visibility of personal data form

  // Form validation for cards
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!cardNumber.match(/^\d{13,19}$/)) {
      errors.cardNumber = 'El número de tarjeta debe tener entre 13 y 19 dígitos.';
    }
    if (!cardHolder.trim()) {
      errors.cardHolder = 'El nombre del titular de la tarjeta es obligatorio.';
    }
    // Basic expiry date validation (MM/YY format, future date)
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiryDate = 'Formato inválido (MM/AA).';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
      const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'La fecha de vencimiento debe ser futura.';
      }
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      errors.cvv = 'El CVV debe tener 3 o 4 dígitos.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear card form fields
  const clearForm = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    setEditingCardId(null);
    setFormErrors({});
  };

  // Handle adding or updating a card
  const handleSaveCard = () => {
    if (!validateForm()) {
      return;
    }

    // Generate a unique ID for new cards
    const newId = editingCardId || Date.now().toString();

    const newCardData: CardData = {
      id: newId,
      cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces for storage
      cardHolder,
      expiryDate,
      cvv,
      last4Digits: cardNumber.slice(-4), // Store last 4 digits for display
      timestamp: new Date()
    };

    if (editingCardId) {
      // Update existing card in state
      setCards(prevCards =>
        prevCards.map(card => (card.id === editingCardId ? newCardData : card))
      );
      console.log("Tarjeta actualizada con éxito!");
    } else {
      // Add new card to state
      setCards(prevCards => [...prevCards, newCardData]);
      console.log("Tarjeta añadida con éxito!");
    }
    clearForm();
  };

  // Handle editing a card
  const handleEditCard = (card: CardData) => {
    setEditingCardId(card.id);
    setCardNumber(card.cardNumber);
    setCardHolder(card.cardHolder);
    setExpiryDate(card.expiryDate);
    setCvv(card.cvv);
    setFormErrors({}); // Clear errors when editing
  };

  // Handle deleting a card
  const handleDeleteCard = (card: CardData) => {
    setCardToDelete(card);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion in dialog for cards
  const confirmDelete = () => {
    setOpenDeleteDialog(false);
    if (!cardToDelete) {
      return;
    }

    // Remove card from state
    setCards(prevCards => prevCards.filter(card => card.id !== cardToDelete.id));
    console.log("Tarjeta eliminada con éxito!");
    clearForm(); // Clear form if the deleted card was being edited
    setCardToDelete(null); // Clear card to delete
  };

  // Handle dialog close (cancel deletion) for cards
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCardToDelete(null);
  };

  // Format card number for display (add spaces)
  const formatCardNumber = (value: string): string => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Handle input change for card number to format it
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 19) value = value.slice(0, 19); // Max 19 digits
    setCardNumber(value);
  };

  // Handle input change for expiry date to format it
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiryDate(value);
  };

  // Handle input change for CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 4) value = value.slice(0, 4); // Max 4 digits
    setCvv(value);
  };

  // --- Personal Data Management Functions ---

  // Form validation for personal data
  const validatePersonalForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio.';
    }
    if (!lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio.';
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Formato de correo electrónico inválido.';
    }
    if (!address.trim()) {
      errors.address = 'La dirección es obligatoria.';
    }
    if (!phone.match(/^\d{7,15}$/)) { // Basic phone validation (7-15 digits)
      errors.phone = 'El teléfono debe tener entre 7 y 15 dígitos.';
    }
    setPersonalFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear personal data form fields
  const clearPersonalForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setAddress('');
    setPhone('');
    setEditingPersonalId(null);
    setPersonalFormErrors({});
    setShowPersonalForm(false); // Hide form after clear/cancel
  };

  // Handle adding or updating personal data
  const handleSavePersonalData = () => {
    if (!validatePersonalForm()) {
      return;
    }

    const newId = editingPersonalId || (personalDataList.length > 0 ? personalDataList[0].id : Date.now().toString());

    const newPersonalData: PersonalData = {
      id: newId,
      firstName,
      lastName,
      email,
      address,
      phone,
      timestamp: new Date()
    };

    if (personalDataList.length > 0) { // Only one item allowed, so if list has item, it's always an edit
      setPersonalDataList(prevList =>
        prevList.map(data => (data.id === newId ? newPersonalData : data))
      );
      console.log("Datos personales actualizados con éxito!");
    } else {
      setPersonalDataList([newPersonalData]); // Add the first item
      console.log("Datos personales añadidos con éxito!");
    }
    clearPersonalForm(); // This will also hide the form
  };

  // Handle editing personal data
  const handleEditPersonalData = (data: PersonalData) => {
    setEditingPersonalId(data.id);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    setAddress(data.address);
    setPhone(data.phone);
    setPersonalFormErrors({});
    setShowPersonalForm(true); // Show form for editing
  };

  // Handle deleting personal data
  const handleDeletePersonalData = (data: PersonalData) => {
    setPersonalToDelete(data);
    setOpenDeletePersonalDialog(true);
  };

  // Confirm deletion in dialog for personal data
  const confirmPersonalDelete = () => {
    setOpenDeletePersonalDialog(false);
    if (!personalToDelete) {
      return;
    }

    setPersonalDataList([]); // Clear the list as only one item is allowed
    console.log("Datos personales eliminados con éxito!");
    clearPersonalForm(); // This will also hide the form
    setPersonalToDelete(null);
  };

  // Handle dialog close (cancel deletion) for personal data
  const handleCloseDeletePersonalDialog = () => {
    setOpenDeletePersonalDialog(false);
    setPersonalToDelete(null);
  };

  // Function to show the personal data form (for adding)
  const handleAddPersonalClick = () => {
    clearPersonalForm(); // Ensure form is clear before showing
    setShowPersonalForm(true);
  };

  // No loading state needed as all operations are local
  const initialLoadComplete = true; // Always true for local state

  return (
    <Box className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter p-6 sm:p-8 md:p-10 flex flex-col items-center">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Sección de Gestión de Tarjetas */}
      <Card className="w-full max-w-2xl p-6 sm:p-8 md:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out mb-10">
        <CardContent className="p-6">
          <Typography variant="h4" component="h1" className="mb-8 text-center font-bold text-blue-600 dark:text-blue-400">
            Gestión de Tarjetas
          </Typography>

          <Box component="form" noValidate autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card Number */}
            <TextField
              label="Número de Tarjeta"
              variant="outlined"
              fullWidth
              value={formatCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              error={!!formErrors.cardNumber}
              helperText={formErrors.cardNumber}
              inputProps={{ maxLength: 19 + 3 }} // 19 digits + 3 spaces
              className="rounded-lg bg-gray-50 dark:bg-gray-700"
              InputLabelProps={{ className: 'dark:text-gray-300' }}
              InputProps={{ className: 'dark:text-gray-100' }}
            />
            {/* Card Holder Name */}
            <TextField
              label="Nombre del Titular"
              variant="outlined"
              fullWidth
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              error={!!formErrors.cardHolder}
              helperText={formErrors.cardHolder}
              className="rounded-lg bg-gray-50 dark:bg-gray-700"
              InputLabelProps={{ className: 'dark:text-gray-300' }}
              InputProps={{ className: 'dark:text-gray-100' }}
            />
            {/* Expiry Date */}
            <TextField
              label="Fecha de Vencimiento (MM/AA)"
              variant="outlined"
              fullWidth
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/AA"
              error={!!formErrors.expiryDate}
              helperText={formErrors.expiryDate}
              inputProps={{ maxLength: 5 }}
              className="rounded-lg bg-gray-50 dark:bg-gray-700"
              InputLabelProps={{ className: 'dark:text-gray-300' }}
              InputProps={{ className: 'dark:text-gray-100' }}
            />
            {/* CVV */}
            <TextField
              label="CVV"
              variant="outlined"
              fullWidth
              type="password" // Use password type for CVV input for security
              value={cvv}
              onChange={handleCvvChange}
              error={!!formErrors.cvv}
              helperText={formErrors.cvv}
              inputProps={{ maxLength: 4 }}
              className="rounded-lg bg-gray-50 dark:bg-gray-700"
              InputLabelProps={{ className: 'dark:text-gray-300' }}
              InputProps={{ className: 'dark:text-gray-100' }}
            />

            {/* Action Buttons */}
            <Box className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearForm}
                className="rounded-full px-8 py-3 transition-transform transform hover:scale-105"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={editingCardId ? <SaveIcon /> : <AddCardIcon />}
                onClick={handleSaveCard}
                className="rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                {editingCardId ? 'Guardar Cambios' : 'Añadir Tarjeta'}
              </Button>
            </Box>
          </Box>

          <Typography variant="h5" className="mb-6 text-center font-semibold text-gray-700 dark:text-gray-200">
            Sus Tarjetas Guardadas
          </Typography>

          {cards.length === 0 && (
            <Typography className="text-center text-gray-500 dark:text-gray-400 py-4">
              Aún no hay tarjetas añadidas.
            </Typography>
          )}

          <List className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner p-2">
            <TransitionGroup>
              {cards.map((card) => (
                <Collapse key={card.id}>
                  <ListItem
                    className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 py-4 px-6 flex items-center justify-between"
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" className="font-medium text-gray-800 dark:text-gray-100">
                          **** **** **** {card.last4Digits}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" className="text-gray-600 dark:text-gray-300">
                            {card.cardHolder}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" className="text-gray-500 dark:text-gray-400">
                            Vence: {card.expiryDate}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction className="flex items-center gap-3">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditCard(card)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 transition-colors p-2"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteCard(card)}
                        className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-500 transition-colors p-2"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog for Cards */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dark:bg-gray-900 bg-opacity-70"
      >
        <DialogTitle id="alert-dialog-title" className="bg-red-500 text-white dark:bg-red-700 rounded-t-lg px-6 py-4">
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-6 px-6">
          <DialogContentText id="alert-dialog-description" className="text-lg">
            ¿Está seguro de que desea eliminar la tarjeta terminada en{' '}
            <span className="font-bold">{cardToDelete?.last4Digits}</span>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-gray-100 dark:bg-gray-700 rounded-b-lg p-4">
          <Button
            onClick={handleCloseDeleteDialog}
            color="secondary"
            variant="outlined"
            className="rounded-full px-6 py-2 transition-transform transform hover:scale-105"
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="primary"
            variant="contained"
            autoFocus
            className="rounded-full px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sección de Datos Personales */}
      <Card className="w-full max-w-2xl p-6 sm:p-8 md:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
        <CardContent className="p-6">
          <Typography variant="h4" component="h1" className="mb-8 text-center font-bold text-blue-600 dark:text-blue-400">
            Datos Personales
          </Typography>

          {personalDataList.length === 0 && !showPersonalForm && (
            <Box className="flex justify-center mb-8">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleAddPersonalClick}
                className="rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                Añadir Datos Personales
              </Button>
            </Box>
          )}

          {showPersonalForm && (
            <Box component="form" noValidate autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* First Name */}
              <TextField
                label="Nombres"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!personalFormErrors.firstName}
                helperText={personalFormErrors.firstName}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
                InputLabelProps={{ className: 'dark:text-gray-300' }}
                InputProps={{ className: 'dark:text-gray-100' }}
              />
              {/* Last Name */}
              <TextField
                label="Apellidos"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!personalFormErrors.lastName}
                helperText={personalFormErrors.lastName}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
                InputLabelProps={{ className: 'dark:text-gray-300' }}
                InputProps={{ className: 'dark:text-gray-100' }}
              />
              {/* Email */}
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!personalFormErrors.email}
                helperText={personalFormErrors.email}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
                InputLabelProps={{ className: 'dark:text-gray-300' }}
                InputProps={{ className: 'dark:text-gray-100' }}
              />
              {/* Address */}
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!personalFormErrors.address}
                helperText={personalFormErrors.address}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
                InputLabelProps={{ className: 'dark:text-gray-300' }}
                InputProps={{ className: 'dark:text-gray-100' }}
              />
              {/* Phone */}
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Allow only digits
                error={!!personalFormErrors.phone}
                helperText={personalFormErrors.phone}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
                InputLabelProps={{ className: 'dark:text-gray-300' }}
                InputProps={{ className: 'dark:text-gray-100' }}
              />

              {/* Action Buttons */}
              <Box className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearPersonalForm}
                  className="rounded-full px-8 py-3 transition-transform transform hover:scale-105"
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={editingPersonalId ? <SaveIcon /> : <PersonAddIcon />}
                  onClick={handleSavePersonalData}
                  className="rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  {editingPersonalId ? 'Guardar Cambios' : 'Añadir Datos'}
                </Button>
              </Box>
            </Box>
          )}

          {personalDataList.length > 0 && (
            <Box className="mt-8">
              <Typography variant="h5" className="mb-6 text-center font-semibold text-gray-700 dark:text-gray-200">
                Sus Datos Personales Guardados
              </Typography>
              {personalDataList.map((data) => (
                <Card key={data.id} className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner mb-6">
                  <CardContent className="p-0">
                    <Typography variant="subtitle1" className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Nombre Completo: {data.firstName} {data.lastName}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-1">
                      Correo: {data.email}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-1">
                      Dirección: {data.address}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                      Teléfono: {data.phone}
                    </Typography>
                    <Box className="flex justify-end gap-3 mt-4">
                      <IconButton
                        aria-label="edit-personal"
                        onClick={() => handleEditPersonalData(data)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 transition-colors p-2"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete-personal"
                        onClick={() => handleDeletePersonalData(data)}
                        className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-500 transition-colors p-2"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog for Personal Data */}
      <Dialog
        open={openDeletePersonalDialog}
        onClose={handleCloseDeletePersonalDialog}
        aria-labelledby="personal-alert-dialog-title"
        aria-describedby="personal-alert-dialog-description"
        className="dark:bg-gray-900 bg-opacity-70"
      >
        <DialogTitle id="personal-alert-dialog-title" className="bg-red-500 text-white dark:bg-red-700 rounded-t-lg px-6 py-4">
          {"Confirmar Eliminación de Datos Personales"}
        </DialogTitle>
        <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-6 px-6">
          <DialogContentText id="personal-alert-dialog-description" className="text-lg">
            ¿Está seguro de que desea eliminar los datos personales de{' '}
            <span className="font-bold">{personalToDelete?.firstName} {personalToDelete?.lastName}</span>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-gray-100 dark:bg-gray-700 rounded-b-lg p-4">
          <Button
            onClick={handleCloseDeletePersonalDialog}
            color="secondary"
            variant="outlined"
            className="rounded-full px-6 py-2 transition-transform transform hover:scale-105"
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmPersonalDelete}
            color="primary"
            variant="contained"
            autoFocus
            className="rounded-full px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
