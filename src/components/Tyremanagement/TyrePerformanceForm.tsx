// import './TyrePerformanceForm.css'; // CSS file doesn't exist
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Slider,
} from '@mui/material';

interface TyrePerformanceData {
  brand: string;
  model: string;
  size: string;
  dryGrip: number;
  wetGrip: number;
  rollingResistance: number;
  noiseLevel: number;
}

const TyrePerformanceForm: React.FC = () => {
  const [formData, setFormData] = useState<TyrePerformanceData>({
    brand: '',
    model: '',
    size: '',
    dryGrip: 5,
    wetGrip: 5,
    rollingResistance: 5,
    noiseLevel: 5,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSliderChange = (name: keyof TyrePerformanceData) => (
    event: Event,
    newValue: number | number[]
  ) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    // Add your form submission logic here
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Tyre Performance Evaluation
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tyre Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tyre Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tyre Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Dry Grip</Typography>
            <Slider
              value={formData.dryGrip}
              onChange={handleSliderChange('dryGrip')}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Wet Grip</Typography>
            <Slider
              value={formData.wetGrip}
              onChange={handleSliderChange('wetGrip')}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Rolling Resistance</Typography>
            <Slider
              value={formData.rollingResistance}
              onChange={handleSliderChange('rollingResistance')}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Noise Level</Typography>
            <Slider
              value={formData.noiseLevel}
              onChange={handleSliderChange('noiseLevel')}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TyrePerformanceForm;
