
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CardHeaderProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  sx?: Record<string, any>;
  [key: string]: any; // For other props
}

/**
 * CardHeader
 *
 * A CardHeader component
 *
 * @example
 * ```tsx
 * <CardHeader title={<div />} subheader={<div />} avatar={<div />} action={<div />} sx="example" key="example" />
 * ```
 *
 * @param props - Component props
 * @param props.title - title of the component
 * @param props.subheader - subheader of the component
 * @param props.avatar - avatar of the component
 * @param props.action - action of the component
 * @param props.sx - sx of the component
 * @param props.key - For other props
 * @returns React component
 */
function CardHeader(props: CardHeaderProps) {
  const { title, subheader, avatar, action, sx, ...other } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, ...sx }} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {avatar && <Box sx={{ mr: 1 }}>{avatar}</Box>}
        <Box>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          {subheader && (
            <Typography variant="subtitle2" color="text.secondary">
              {subheader}
            </Typography>
          )}
        </Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}

CardHeader.propTypes = {
  action: PropTypes.node,
  avatar: PropTypes.node,
  subheader: PropTypes.node,
  sx: PropTypes.object,
  title: PropTypes.node,
};

export default CardHeader;
