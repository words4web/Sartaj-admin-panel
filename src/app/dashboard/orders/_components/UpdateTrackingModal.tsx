"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UpdateTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackingNumber?: string;
  onUpdate: (trackingNumber: string) => void;
  isLoading: boolean;
}

export function UpdateTrackingModal({
  isOpen,
  onClose,
  currentTrackingNumber,
  onUpdate,
  isLoading,
}: UpdateTrackingModalProps) {
  const [trackingNumber, setTrackingNumber] = useState(
    currentTrackingNumber || "",
  );

  useEffect(() => {
    if (isOpen) {
      setTrackingNumber(currentTrackingNumber || "");
    }
  }, [isOpen, currentTrackingNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(trackingNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Update Order Tracking Number
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="tracking-number"
              className="text-sm font-semibold text-gray-700">
              Tracking Number
            </Label>
            <Input
              id="tracking-number"
              placeholder="tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              disabled={isLoading}
              required
              type="text"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl font-bold border-gray-200">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !trackingNumber}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white min-w-[100px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
