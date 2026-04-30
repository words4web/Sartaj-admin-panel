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
  currentUrl?: string;
  onUpdate: (url: string) => void;
  isLoading: boolean;
}

export function UpdateTrackingModal({
  isOpen,
  onClose,
  currentUrl,
  onUpdate,
  isLoading,
}: UpdateTrackingModalProps) {
  const [url, setUrl] = useState(currentUrl || "");

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl || "");
    }
  }, [isOpen, currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Update Tracking URL
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="tracking-url"
              className="text-sm font-semibold text-gray-700">
              Tracking URL
            </Label>
            <Input
              id="tracking-url"
              placeholder="https://track.example.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              disabled={isLoading}
              required
              type="url"
            />
            <p className="text-[10px] text-gray-500 italic">
              Enter the full URL where the customer can track their order.
            </p>
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
              disabled={isLoading || !url}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white min-w-[100px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Tracking URL"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
