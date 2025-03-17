"use client";

import guardbot from "@/public/guardbot1.svg";
import { useRef, useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Copy,
  Pause,
  Play,
  RefreshCw,
  Upload,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  PixelMotion,
  type PixelMotionProps,
  type GridOptions,
} from "@ga1az/react-pixel-motion";
import { darkTheme } from "./code-block";

export default function SandBox() {
  const [sandboxConfig, setSandboxConfig] = useState<PixelMotionProps>({
    height: 32,
    width: 30,
    fps: 8,
    frameCount: 3,
    startFrame: 0,
    scale: 3,
    shouldAnimate: true,
    sprite: guardbot,
    direction: "horizontal",
  });
  const [uploadedSprite, setUploadedSprite] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDirectionDropdown, setShowDirectionDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directionDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize grid options if not present
  useEffect(() => {
    if (sandboxConfig.direction === "grid" && !sandboxConfig.gridOptions) {
      updateSandboxParam("gridOptions", {
        columns: 3,
        rows: 3,
        gap: 0,
      });
    }
  }, [sandboxConfig.direction, sandboxConfig.gridOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        directionDropdownRef.current &&
        !directionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDirectionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateSandboxParam = (param: string, value: unknown) => {
    setSandboxConfig((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  // Update grid options
  const updateGridOptions = (param: keyof GridOptions, value: number) => {
    if (sandboxConfig.direction === "grid" && sandboxConfig.gridOptions) {
      setSandboxConfig((prev) => {
        if (prev.direction === "grid" && prev.gridOptions) {
          return {
            ...prev,
            gridOptions: {
              ...prev.gridOptions,
              [param]: value,
            },
          };
        }
        return prev;
      });
    }
  };

  const handleDirectionChange = (
    direction: "horizontal" | "vertical" | "grid"
  ) => {
    if (direction === "grid") {
      updateSandboxParam("direction", direction);
      updateSandboxParam("gridOptions", {
        columns: 3,
        rows: 3,
        gap: 0,
      });
    } else {
      updateSandboxParam("direction", direction);
      // Remove gridOptions when not in grid mode
      setSandboxConfig((prev) => {
        // Use type assertion to handle the union type
        if ("gridOptions" in prev) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { gridOptions, ...rest } = prev;
          return rest as PixelMotionProps;
        }
        return prev;
      });
    }
    setShowDirectionDropdown(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedSprite(url);
      updateSandboxParam("sprite", url);
    }
  };

  const handleCopyCode = () => {
    const codeString = generateCodeString();
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCodeString = () => {
    let codeString = `<PixelMotion
  height={${sandboxConfig.height}}
  width={${sandboxConfig.width}}
  fps={${sandboxConfig.fps}}
  frameCount={${sandboxConfig.frameCount}}
  startFrame={${sandboxConfig.startFrame}}
  scale={${sandboxConfig.scale}}
  shouldAnimate={${sandboxConfig.shouldAnimate}}
  sprite="${sandboxConfig.sprite}"`;

    if (sandboxConfig.direction !== "horizontal") {
      codeString += `\n  direction="${sandboxConfig.direction}"`;
    }

    if (sandboxConfig.direction === "grid" && sandboxConfig.gridOptions) {
      const { columns, rows, rowIndex, columnIndex, gap } =
        sandboxConfig.gridOptions;
      codeString += `\n  gridOptions={{
    columns: ${columns},
    rows: ${rows}${
        rowIndex !== undefined ? `,\n    rowIndex: ${rowIndex}` : ""
      }${
        columnIndex !== undefined ? `,\n    columnIndex: ${columnIndex}` : ""
      }${gap !== undefined ? `,\n    gap: ${gap}` : ""}
  }}`;
    }

    codeString += "\n/>";
    return codeString;
  };

  // Prepare props for PixelMotion component based on current configuration
  const getPixelMotionProps = () => {
    const baseProps = {
      height: sandboxConfig.height,
      width: sandboxConfig.width,
      fps: sandboxConfig.fps,
      frameCount: sandboxConfig.frameCount,
      startFrame: sandboxConfig.startFrame,
      scale: sandboxConfig.scale,
      shouldAnimate: sandboxConfig.shouldAnimate,
      sprite: sandboxConfig.sprite,
    };

    if (sandboxConfig.direction === "grid" && sandboxConfig.gridOptions) {
      return {
        ...baseProps,
        direction: "grid" as const,
        gridOptions: sandboxConfig.gridOptions,
      };
    }

    return {
      ...baseProps,
      direction: sandboxConfig.direction,
    };
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-1/2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="height">
                Height (px): {sandboxConfig.height}
              </Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="height"
              min={8}
              max={128}
              step={1}
              value={[sandboxConfig.height]}
              onValueChange={(value) => updateSandboxParam("height", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="width">Width (px): {sandboxConfig.width}</Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="width"
              min={8}
              max={128}
              step={1}
              value={[sandboxConfig.width]}
              onValueChange={(value) => updateSandboxParam("width", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fps">FPS: {sandboxConfig.fps}</Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="fps"
              min={1}
              max={30}
              step={1}
              value={[sandboxConfig.fps ?? 1]}
              onValueChange={(value) => updateSandboxParam("fps", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="frameCount">
                Number of frames: {sandboxConfig.frameCount}
              </Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="frameCount"
              min={1}
              max={24}
              step={1}
              value={[sandboxConfig.frameCount ?? 1]}
              onValueChange={(value) =>
                updateSandboxParam("frameCount", value[0])
              }
            />
          </div>

          {/* Direction selector */}
          <div className="space-y-2 relative" ref={directionDropdownRef}>
            <Label htmlFor="direction" className="block">
              Direction: {sandboxConfig.direction}
            </Label>
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setShowDirectionDropdown(!showDirectionDropdown)}
            >
              <span className="capitalize">{sandboxConfig.direction}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showDirectionDropdown && (
              <div className=" z-20 mt-1 w-full bg-background border rounded-md shadow-lg">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none hover:bg-accent"
                  onClick={() => handleDirectionChange("horizontal")}
                >
                  Horizontal
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none hover:bg-accent"
                  onClick={() => handleDirectionChange("vertical")}
                >
                  Vertical
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none hover:bg-accent"
                  onClick={() => handleDirectionChange("grid")}
                >
                  Grid
                </Button>
              </div>
            )}
          </div>

          {/* Grid options */}
          {sandboxConfig.direction === "grid" && sandboxConfig.gridOptions && (
            <div className="space-y-4 border p-4 rounded-md bg-muted/20">
              <h3 className="font-medium">Grid Options</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="columns">
                    Columns: {sandboxConfig.gridOptions.columns}
                  </Label>
                </div>
                <Slider
                  className="cursor-pointer"
                  id="columns"
                  min={1}
                  max={12}
                  step={1}
                  value={[sandboxConfig.gridOptions.columns]}
                  onValueChange={(value) =>
                    updateGridOptions("columns", value[0])
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rows">
                    Rows: {sandboxConfig.gridOptions.rows}
                  </Label>
                </div>
                <Slider
                  className="cursor-pointer"
                  id="rows"
                  min={1}
                  max={12}
                  step={1}
                  value={[sandboxConfig.gridOptions.rows]}
                  onValueChange={(value) => updateGridOptions("rows", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="gap">
                    Gap (px): {sandboxConfig.gridOptions.gap ?? 0}
                  </Label>
                </div>
                <Slider
                  className="cursor-pointer"
                  id="gap"
                  min={0}
                  max={20}
                  step={1}
                  value={[sandboxConfig.gridOptions.gap ?? 0]}
                  onValueChange={(value) => updateGridOptions("gap", value[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="row-index-toggle">Specific row</Label>
                    <Switch
                      id="row-index-toggle"
                      className="z-10 cursor-pointer"
                      checked={sandboxConfig.gridOptions.rowIndex !== undefined}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateGridOptions("rowIndex", 0);
                        } else {
                          setSandboxConfig((prev) => {
                            if (prev.direction === "grid" && prev.gridOptions) {
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                              const { rowIndex, ...rest } = prev.gridOptions;
                              return {
                                ...prev,
                                gridOptions: rest,
                              };
                            }
                            return prev;
                          });
                        }
                      }}
                    />
                  </div>
                  {sandboxConfig.gridOptions.rowIndex !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rowIndex">
                          Row index: {sandboxConfig.gridOptions.rowIndex}
                        </Label>
                      </div>
                      <Slider
                        className="cursor-pointer mt-2"
                        id="rowIndex"
                        min={0}
                        max={sandboxConfig.gridOptions.rows - 1}
                        step={1}
                        value={[sandboxConfig.gridOptions.rowIndex]}
                        onValueChange={(value) =>
                          updateGridOptions("rowIndex", value[0])
                        }
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="column-index-toggle">Specific column</Label>
                    <Switch
                      id="column-index-toggle"
                      className="z-10 cursor-pointer"
                      checked={
                        sandboxConfig.gridOptions.columnIndex !== undefined
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateGridOptions("columnIndex", 0);
                        } else {
                          setSandboxConfig((prev) => {
                            if (prev.direction === "grid" && prev.gridOptions) {
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                              const { columnIndex, ...rest } = prev.gridOptions;
                              return {
                                ...prev,
                                gridOptions: rest,
                              };
                            }
                            return prev;
                          });
                        }
                      }}
                    />
                  </div>
                  {sandboxConfig.gridOptions.columnIndex !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between">
                        <Label htmlFor="columnIndex">
                          Column index: {sandboxConfig.gridOptions.columnIndex}
                        </Label>
                      </div>
                      <Slider
                        className="cursor-pointer mt-2"
                        id="columnIndex"
                        min={0}
                        max={sandboxConfig.gridOptions.columns - 1}
                        step={1}
                        value={[sandboxConfig.gridOptions.columnIndex]}
                        onValueChange={(value) =>
                          updateGridOptions("columnIndex", value[0])
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="startFrame">
                Initial frame: {sandboxConfig.startFrame}
              </Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="startFrame"
              min={0}
              max={sandboxConfig.frameCount ? sandboxConfig.frameCount - 1 : 0}
              step={1}
              value={[sandboxConfig.startFrame ?? 0]}
              onValueChange={(value) =>
                updateSandboxParam("startFrame", value[0])
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="scale">
                Scale: {sandboxConfig.scale?.toFixed(1)}x
              </Label>
            </div>
            <Slider
              className="cursor-pointer"
              id="scale"
              min={0.5}
              max={10}
              step={0.1}
              value={[sandboxConfig.scale ?? 1]}
              onValueChange={(value) => updateSandboxParam("scale", value[0])}
            />
          </div>

          <div className="flex items-center justify-between space-y-0 pt-2">
            <Label htmlFor="animation-toggle">Animation</Label>
            <div className="flex items-center gap-2">
              {sandboxConfig.shouldAnimate ? (
                <Play className="h-4 w-4 text-green-500" />
              ) : (
                <Pause className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                id="animation-toggle"
                className="z-10 cursor-pointer"
                checked={sandboxConfig.shouldAnimate}
                onCheckedChange={(checked) =>
                  updateSandboxParam("shouldAnimate", checked)
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Label htmlFor="sprite-upload" className="mb-2 block">
              Upload Spritesheet
            </Label>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full z-10 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select file
              </Button>
              <Button
                className="z-10 cursor-pointer w-full"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (uploadedSprite) {
                    URL.revokeObjectURL(uploadedSprite);
                    setUploadedSprite(null);
                  }
                  updateSandboxParam("sprite", "/guardbot1.svg");
                  updateSandboxParam("direction", "horizontal");
                  updateSandboxParam("gridOptions", undefined);
                  updateSandboxParam("height", 32);
                  updateSandboxParam("width", 30);
                  updateSandboxParam("fps", 8);
                  updateSandboxParam("frameCount", 3);
                  updateSandboxParam("startFrame", 0);
                  updateSandboxParam("scale", 3);
                  updateSandboxParam("shouldAnimate", true);
                }}
                title="Reset to default sprite"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              id="sprite-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="preview" className="w-full lg:w-1/2 mb-10 lg:mb-0">
        <TabsList className="w-full mb-4 z-10">
          <TabsTrigger value="preview" className="flex-1 z-10 text-lg">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex-1 z-10 text-lg">
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-0">
          <div className="flex justify-center items-center p-8 min-h-[250px] bg-muted/10 rounded-lg border">
            <PixelMotion {...getPixelMotionProps()} />
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <div className="relative">
            <pre className="bg-muted/10 p-4 rounded-lg overflow-x-auto text-sm font-mono min-h-[250px] border">
              <SyntaxHighlighter
                language="tsx"
                style={darkTheme}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "transparent",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {generateCodeString()}
              </SyntaxHighlighter>
            </pre>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
