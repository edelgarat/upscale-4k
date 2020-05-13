import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default ({ children, name, value }: { name?: string; children: JSX.Element; value?: string | number }) => {
  return (
    <Box marginTop="4px">
      {name && (
        <Box>
          <Typography>{name}</Typography>
        </Box>
      )}
      <Box display="flex" alignItems="center">
        {children}
        {value && (
          <Box width={40} paddingLeft="4px">
            <Typography align="right">{value}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
