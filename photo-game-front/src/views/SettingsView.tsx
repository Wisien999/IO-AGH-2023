import React from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function SettingsView() {
    const navigate = useNavigate();
    return (
        <Dialog open={true} onClose={() => navigate('..')}>
            <DialogTitle>Game params</DialogTitle>
            <DialogContent>
                TESTESTTESTSE
            </DialogContent>
        </Dialog>
    )
}
