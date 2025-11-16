import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  family: string;
  thcLevel: string;
  bank: string;
}

const families = ['Todas', 'INDICA', 'HÍBRIDA', 'SATIVA'];
const thcLevels = ['Todos', 'Alto (25%+)', 'Muy Alto (28%+)'];
const banks = ['Todos', 'Shuga Seeds', 'Barneys Farm'];

export const FilterPanel = ({ onFilterChange, activeFilters }: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);
  const [open, setOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = { family: 'Todas', thcLevel: 'Todos', bank: 'Todos' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = localFilters.family !== 'Todas' || 
                          localFilters.thcLevel !== 'Todos' || 
                          localFilters.bank !== 'Todos';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="relative border-cannabis-green/30 hover:border-cannabis-green hover:bg-cannabis-green/10 transition-all duration-300"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-cannabis-green text-xs">
              {[localFilters.family !== 'Todas', localFilters.thcLevel !== 'Todos', localFilters.bank !== 'Todos'].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="text-foreground">Filtrar Genéticas</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Refina tu búsqueda por características específicas
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Family Filter */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Familia</Label>
            <RadioGroup
              value={localFilters.family}
              onValueChange={(value) => handleFilterChange('family', value)}
              className="space-y-3"
            >
              {families.map((family) => (
                <div key={family} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={family} 
                    id={`family-${family}`}
                    className="border-cannabis-green data-[state=checked]:bg-cannabis-green data-[state=checked]:border-cannabis-green"
                  />
                  <Label
                    htmlFor={`family-${family}`}
                    className="text-sm font-normal cursor-pointer hover:text-cannabis-green-light transition-colors"
                  >
                    {family}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* THC Level Filter */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Nivel THC</Label>
            <RadioGroup
              value={localFilters.thcLevel}
              onValueChange={(value) => handleFilterChange('thcLevel', value)}
              className="space-y-3"
            >
              {thcLevels.map((level) => (
                <div key={level} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={level} 
                    id={`thc-${level}`}
                    className="border-cannabis-purple data-[state=checked]:bg-cannabis-purple data-[state=checked]:border-cannabis-purple"
                  />
                  <Label
                    htmlFor={`thc-${level}`}
                    className="text-sm font-normal cursor-pointer hover:text-cannabis-purple-light transition-colors"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Bank Filter */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Banco</Label>
            <RadioGroup
              value={localFilters.bank}
              onValueChange={(value) => handleFilterChange('bank', value)}
              className="space-y-3"
            >
              {banks.map((bank) => (
                <div key={bank} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={bank} 
                    id={`bank-${bank}`}
                    className="border-cannabis-accent data-[state=checked]:bg-cannabis-accent data-[state=checked]:border-cannabis-accent"
                  />
                  <Label
                    htmlFor={`bank-${bank}`}
                    className="text-sm font-normal cursor-pointer hover:text-cannabis-accent transition-colors"
                  >
                    {bank}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
