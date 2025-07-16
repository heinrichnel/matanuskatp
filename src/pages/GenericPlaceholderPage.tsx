import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { Construction } from '@mui/icons-material';

interface GenericPlaceholderPageProps {
  title: string;
}

/**
 * A generic placeholder component for routes that are not yet implemented
 */
const GenericPlaceholderPage: React.FC<GenericPlaceholderPageProps> = ({ title }) => {
  return (
    <Container maxWidth="lg">
      <Paper 
        sx={{ 
          p: 4, 
          mt: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center' 
        }}
      >
        <Construction sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary">
          This feature is currently under development.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Check back soon for updates or contact the development team for more information.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default GenericPlaceholderPage;
