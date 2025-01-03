import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@nextui-org/drawer";

// INFO: Use the following to handle the drawer state.
// import { useDisclosure } from "@nextui-org/use-disclosure";
// const { isOpen, onOpen, onOpenChange } = useDisclosure();

export default function NextDrawer({
  isOpen,
  onClose,
  onOpenChange,
  title,
  children,
  size,
  radius = "none",
  placement = "right",
  shouldBlockScroll,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      size={size}
      radius={radius}
      shouldBlockScroll={shouldBlockScroll}
      placement={placement}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="text-lg font-bold flex flex-col gap-1">
              {title}
            </DrawerHeader>
            <DrawerBody className="p-2">{children}</DrawerBody>
            {/* <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
              </DrawerFooter> */}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
