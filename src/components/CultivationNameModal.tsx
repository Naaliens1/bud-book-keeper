import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CultivationNameModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  geneticName: string;
}

export const CultivationNameModal = ({ open, onClose, onConfirm, geneticName }: CultivationNameModalProps) => {
  const [cultivationName, setCultivationName] = useState(`${geneticName} - Pheno 1`);

  const handleConfirm = () => {
    if (cultivationName.trim()) {
      onConfirm(cultivationName.trim());
      setCultivationName(`${geneticName} - Pheno 1`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Nuevo Cultivo</DialogTitle>
          <DialogDescription>
            Dale un nombre único a esta instancia de cultivo para identificarla fácilmente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cultivation-name">Nombre del Cultivo</Label>
            <Input
              id="cultivation-name"
              placeholder={`Ej: ${geneticName} - Pheno 1 o Planta Madre`}
              value={cultivationName}
              onChange={(e) => setCultivationName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!cultivationName.trim()}>
            Iniciar Cultivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};