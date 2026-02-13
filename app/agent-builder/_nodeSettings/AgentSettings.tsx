"use client"
import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

// Component is now a "pure" form that reports back to the parent
function AgentSettings({ selectedNode, updateFormData }: any) {
    const [formData, setFormData] = useState({
        name: '',
        instruction: '',
        includeChatHistory: true,
        model: 'gemini-flash-1.5',
        output: 'text',
        schema: '',
    });

    // Sync form with node whenever user clicks a different node
    useEffect(() => {
        if (selectedNode?.data) {
            setFormData({
                name: selectedNode.data.name || '',
                instruction: selectedNode.data.instruction || '',
                includeChatHistory: selectedNode.data.includeChatHistory ?? true,
                model: selectedNode.data.model || 'gemini-flash-1.5',
                output: selectedNode.data.output || 'text',
                schema: selectedNode.data.schema || '',
            });
        }
    }, [selectedNode]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value
        })) 
    }

    const onSave = () => {
        // Only call the parent function. Let the parent handle 'setNodes'.
        updateFormData(formData);
        console.log('Settings sent to parent for global update');
    }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Agent Settings</h2>
        <p className="text-sm text-muted-foreground">Configure the AI model behavior for this node.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className='text-sm font-semibold'>Agent Name</Label>
          <Input 
            value={formData.name} 
            placeholder='e.g. Research Assistant' 
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className='text-sm font-semibold'>System Instruction</Label>
          <Textarea 
            value={formData.instruction} 
            placeholder='You are a helpful assistant that...' 
            onChange={(e) => handleChange('instruction', e.target.value)} 
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center justify-between p-2 border rounded-lg bg-slate-50">
          <Label className='text-sm font-medium'>Include Chat History</Label>
          <Switch 
            checked={formData.includeChatHistory} 
            onCheckedChange={(checked) => handleChange('includeChatHistory', checked)} 
          />
        </div>

        <div className="space-y-2">
          <Label className='text-sm font-semibold'>Model Selection</Label>
          <Select value={formData.model} onValueChange={(value) => handleChange('model', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-flash-1.5">Gemini 1.5 Flash (Fast)</SelectItem>
              <SelectItem value="gemini-pro-1.5">Gemini 1.5 Pro (Complex)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className='text-sm font-semibold'>Output Format</Label>
          <Tabs value={formData.output} onValueChange={(value) => handleChange('output', value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="pt-2">
              <Label className="text-[10px] uppercase text-slate-500">JSON Schema</Label>
              <Textarea 
                value={formData.schema} 
                placeholder='{ "type": "object", ... }' 
                onChange={(e) => handleChange('schema', e.target.value)} 
                className="font-mono text-xs"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Button className="w-full" onClick={onSave}>
        Update Node
      </Button>
    </div>
  )
}

export default AgentSettings